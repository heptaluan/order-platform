<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" class="w-4/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增问卷</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              icon: 'clarity:note-edit-line',
              tooltip: '编辑问卷',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '启用',
              icon: 'ant-design:delete-outlined',
              color: 'success',
              tooltip: '启用问卷',
              popConfirm: {
                title: '是否确认启用该问卷',
                confirm: handleEnable.bind(null, record),
              },
              ifShow: record.status === '99'
            },
            {
              label: '问卷详情',
              icon: 'akar-icons:link-chain',
              tooltip: '查看问卷详情',
              onClick: handleShowTemplate.bind(null, record),
            },
            {
              label: '新增版本',
              icon: 'akar-icons:link-chain',
              tooltip: '基于当前模板新增版本',
              onClick: handleNewVersion.bind(null, record),
            },
          ]"
        />
      </template>
      <template #status="{ text }">
        <tag :color="text === '01' ? 'green' : text === '99' ? 'cyan': 'grey'">{{text === '01' ? '启用' :  text === '99' ? '未启用': '停用'}}</tag>
      </template>
    </BasicTable>
    <AddTemplateModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getQuestionTemplate,
    saveQuestionTemplate,
    enableQuestionTemplate,
    addTemplateVersion
  } from '/@/api/base/question';

  import { PageWrapper } from '/@/components/Page';

  import { useModal } from '/@/components/Modal';
  import AddTemplateModal from './AddTemplateModal.vue';

  import { templateColumns, templateFormSchema } from './Question.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { Tag } from 'ant-design-vue';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, AddTemplateModal, TableAction, Tag },
    setup() {
      const go = useGo();
      const [registerModal, { openModal: openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { notification } = useMessage();

      const [registerTable, { reload }] = useTable({
        title: '问卷列表',
        api: getQuestionTemplate,
        rowKey: 'id',
        columns: templateColumns,
        formConfig: {
          labelWidth: 120,
          schemas: templateFormSchema,
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
          width: 350,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      const handleShowTemplate = (record: Recordable) => {
        go(`/question/questionTemplateEdit?id=${record.id}`);
      };
      async function handleNewVersion (record: Recordable) {
        const res = await addTemplateVersion({
          id: record.id,
        });
        if (res) {
          notification.success({
            message: '新增问卷版本成功！',
          });
          await reload();
        }
      }

      async function handleEnable(record: Recordable) {
        const res = await enableQuestionTemplate({
          id: record.id,
        });
        if (res) {
          notification.success({
            message: '问卷模板启用成功',
          });
          await reload();
        }
      }

      async function handleSuccess({ isUpdate, values }) {
        const params = {
          ...values,
        };
        const res = await saveQuestionTemplate(params);
        if (res) {
          notification.success({
            message: '操作成功',
            description: isUpdate ? `问卷更新成功！` : `问卷新增成功！`,
          });
          await reload();
        }
      }

      return {
        searchInfo,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleShowTemplate,
        handleEnable,
        handleSuccess,
        handleNewVersion
      };
    },
  });
</script>
