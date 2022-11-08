<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" class="w-4/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleExportCustomerInfo">导出客户信息</a-button>
        <a-button type="primary" @click="handleExportQuestion">导出问卷</a-button>
        <a-button type="primary" @click="handleExportInformedConsentsZip">导出同意书</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '查看问卷',
              icon: 'akar-icons:link-chain',
              tooltip: '查看问卷',
              onClick: handleShowDetail.bind(null, record),
            },
            // {
            //   label: '编辑信息',
            //   icon: 'clarity:note-edit-line',
            //   tooltip: '编辑信息',
            //   onClick: handleEdit.bind(null, record),
            // },
            {
              label: '下载同意书',
              icon: 'akar-icons:link-chain',
              tooltip: '下载同意书',
              onClick: handleDownload.bind(null, record),
            },
          ]"
        />
      </template>
      <!-- <template #status="{ text }">
        <tag :color="text === '01' ? 'green' : text === '99' ? 'cyan': 'grey'">{{text === '01' ? '启用' :  text === '99' ? '未启用': '停用'}}</tag>
      </template> -->
    </BasicTable>
    <QuestionListDetailModal @register="registerQuestionListDetailModal" @success="handleSuccess" />
    <QuestionListEditModal @register="registerQuestionListEditModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, onMounted } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getQuestionnaireList,
    exportQuestionnaireList,
    getAllEnabled,
  } from '/@/api/base/question';
  import { export_json_to_excel } from '/@/utils/xlsx/index';
  import { PageWrapper } from '/@/components/Page';
  import * as XLSX from 'xlsx';
  import axios from 'axios';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';

  import { useModal } from '/@/components/Modal';
  import QuestionListDetailModal from './QuestionListDetailModal.vue';
  import QuestionListEditModal from './QuestionListEditModal.vue';
  import { questionList, questionListFormSchema } from './Question.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AccountManagement',
    components: {
      BasicTable,
      PageWrapper,
      QuestionListDetailModal,
      QuestionListEditModal,
      TableAction,
    },
    setup() {
      const [registerQuestionListDetailModal, { openModal: openQuestionListDetailModal }] =
        useModal();
      const [registerQuestionListEditModal, { openModal: openQuestionListEditModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { createMessage } = useMessage();
      const [registerTable, { getForm }] = useTable({
        title: '问卷列表',
        api: getQuestionnaireList,
        immediate: false,
        rowKey: 'id',
        columns: questionList,
        formConfig: {
          labelWidth: 120,
          schemas: questionListFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        pagination: { pageSize: 10 },
        handleSearchInfoFn(info) {
          return info;
        },
        actionColumn: {
          width: 250,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
        beforeFetch: async (val) => {
          if (!val.templateId) {
            const res = await getAllEnabled();
            val.templateId = res[0].id;
            getForm().setFieldsValue({
              templateId: res[0].id,
            });
            return val;
          } else {
            return val;
          }
        },
      });

      // 查看问卷
      function handleShowDetail(record: Recordable) {
        openQuestionListDetailModal(true, {
          record,
          isUpdate: true,
          id: record.id,
        });
      }

      // 编辑信息
      function handleEdit(record: Recordable) {
        openQuestionListEditModal(true, {
          record,
          isUpdate: true,
        });
      }

      // 下载同意书
      function handleDownload(record: Recordable) {
        if (record.informedConsent) {
          window.open(record.informedConsent);
        } else {
          createMessage.warning(`所选问卷暂无同意书下载`);
        }
      }

      async function handleSuccess({ isUpdate, values }) {
        console.log(isUpdate, values);
      }

      // 导出客户信息
      async function handleExportCustomerInfo() {
        const params = getForm().getFieldsValue();
        const res = await getQuestionnaireList({
          ...params,
          page: 1,
          size: 999999,
        });
        if (res && (res as any).list) {
          exportExcel((res as any).list, '客户信息');
        }
      }

      // 导出问卷
      async function handleExportQuestion() {
        const params = getForm().getFieldsValue();
        const res = await exportQuestionnaireList({
          ...params,
          page: 1,
          size: 999999,
        });
        if (res) {
          const time = new Date();
          const fileName =
            '问卷信息' +
            time.getFullYear() +
            (time.getMonth() + 1) +
            time.getDay() +
            time.getHours() +
            time.getMinutes() +
            time.getSeconds();

          const jsonWorkSheet = XLSX.utils.aoa_to_sheet(res as any);
          const workBook = {
            SheetNames: ['sheet1'],
            Sheets: {
              ['sheet1']: jsonWorkSheet,
            },
          };
          XLSX.writeFile(workBook, `${fileName}.xls`);
        }
      }

      // 导出同意书
      async function handleExportInformedConsentsZip() {
        const params = getForm().getFieldsValue();
        const token = getToken();
        const globSetting = useGlobSetting();
        const url = '/tailai-cloud-questionnaire/questionnaire-customer/exportInformedConsentsZip';
        (axios as any).defaults.headers.common['X-Access-Token'] = token;
        const res = await axios.post(
          globSetting.apiUrl + url,
          { ...params, page: 1, size: 999999 },
          {
            responseType: 'arraybuffer',
          },
        );
        let fileName = '';
        if (res.headers && res.headers['content-disposition']) {
          fileName = decodeURI(res.headers['content-disposition'].split('FileName=')[1]);
        } else {
          fileName = '知情同意书';
        }
        download(res.data, 'application/zip;charset-UTF-8', fileName + '.zip');
      }

      /**
       * @param res 流数据
       * @param type 'application/pdf;charset=UTF-8' 表示下载文档为 pdf，如果是 word 则设置为 msword，excel 为 excel，zip 为 zip
       */
      function download(res, type, filename) {
        const blob = new Blob([res], {
          type: type,
        });
        const a = document.createElement('a');
        const URL = window.URL || window.webkitURL;
        const herf = URL.createObjectURL(blob);
        a.href = herf;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(herf);
      }

      function exportExcel(rows, fileNamePrefix) {
        const Columns = questionList;
        const time = new Date();

        const fileName =
          fileNamePrefix +
          time.getFullYear() +
          (time.getMonth() + 1) +
          time.getDay() +
          time.getHours() +
          time.getMinutes() +
          time.getSeconds();

        const params = {
          data: [],
          key: Columns.map((item) => item.dataIndex),
          filename: fileName,
          autoWidth: true,
          title: {},
          date: '',
        };

        for (let j = 0; j < rows.length; j++) {
          let row = rows[j];
          const _row = {};
          for (let k in params.key) {
            let _key = params.key[k];
            if (_key) _row[_key] = row[_key];
          }
          params.data.push(_row as never);
        }

        // 组织title
        const title = {};
        for (let i in params.key) {
          let _key = params.key[i];
          let col = Columns.find((o) => o.dataIndex === _key);
          if (col && _key) {
            title[_key] = col.title;
          }
        }
        params.title = title;
        console.log(params);
        export_json_to_excel(params as never);
      }

      return {
        onMounted,
        searchInfo,
        registerTable,
        registerQuestionListDetailModal,
        registerQuestionListEditModal,
        handleShowDetail,
        handleEdit,
        handleDownload,
        handleSuccess,
        handleExportCustomerInfo,
        handleExportQuestion,
        handleExportInformedConsentsZip,
      };
    },
  });
</script>
