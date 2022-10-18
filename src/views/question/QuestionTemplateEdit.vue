<template>
  <div class="h-full flex p-4 edit-question">
    <div class="flex flex-col w-2/3">
      <BasicTable
        @register="registerQuestionTable"
        :searchInfo="searchInfo"
        @row-click="handleRowClick"
        @selection-change="handleColumnsChange"
      >
        <template #toolbar>
          <a-button type="primary" @click="handleCreateQuestion" v-if="status==='99'">新增问题</a-button>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                label: '编辑',
                icon: 'clarity:note-edit-line',
                tooltip: '编辑问题选项',
                onClick: handleEditQuestion.bind(null, record),
              },
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除问题选项',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDeleteQuestion.bind(null, record),
                },
                ifShow: status === '99'
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
    <div class="flex flex-col w-1/3">
      <BasicTable @register="registerQuestionDetailTable" :searchInfo="searchInfo">
        <template #toolbar>
          <a-button type="primary" @click="handleCreateQuestionDetail" v-if="status==='99'">新增问题选项</a-button>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                label: '编辑',
                icon: 'clarity:note-edit-line',
                tooltip: '编辑问题选项',
                onClick: handleEditQuestionDetail.bind(null, record),
              },
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除问题选项',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDeleteQuestionDetail.bind(null, record),
                },
                ifShow: status === '99'
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
    <AddQuestionModal @register="registerQuestionModal" @success="handleAddQuestionSuccess" />
    <AddQuestionDetailModal
      @register="registerQuestionDetailModal"
      @success="handleAddQuestionDetailSuccess"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getQuestionList,
    saveQuestionList,
    deleteQuestionById,
    getQuestionDetail,
    saveQuestionDetail,
    deleteQuestionDetail,
    getTemplateFindById,
  } from '/@/api/base/question';

  import { useModal } from '/@/components/Modal';
  import AddQuestionModal from './AddQuestionModal.vue';
  import AddQuestionDetailModal from './AddQuestionDetailModal.vue';

  import {
    questionColumns,
    questionDetailColumns,
    questionFormSchema,
    questionDetailFormSchema,
  } from './Question.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, AddQuestionModal, AddQuestionDetailModal, TableAction },
    setup() {
      const [registerQuestionModal, { openModal: openAddQuestionModal }] = useModal();
      const [registerQuestionDetailModal, { openModal: openAddQuestionDetailModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { notification, createMessage } = useMessage();
      const route = useRoute();
      const id = ref(route.query?.id);
      const questionId = ref('');
      const status = ref('');

      const [registerQuestionTable, { reload, getSelectRows }] = useTable({
        title: '问题列表',
        api: getQuestionList,
        searchInfo: {
          id,
        },
        rowKey: 'id',
        columns: questionColumns,

        formConfig: {
          labelWidth: 120,
          schemas: questionFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        pagination: { pageSize: 10 },
        handleSearchInfoFn(info) {
          return info;
        },
        immediate: false,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
        rowSelection: { type: 'radio' },
      });

      const [registerQuestionDetailTable, { reload: reloadQuestionDetail }] = useTable({
        title: '问题选项',
        api: getQuestionDetail,
        searchInfo: {
          questionId: questionId,
        },
        rowKey: 'id',
        columns: questionDetailColumns,
        formConfig: {
          labelWidth: 120,
          schemas: questionDetailFormSchema,
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
          width: 180,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
        immediate: false,
      });

      // 问题列表点击事件
      const handleRowClick = (record: Recordable) => {
        const rows = getSelectRows();
        if (rows.length > 0) {
          questionId.value = record.id;
          reloadQuestionDetail();
        } else {
          questionId.value = '';
          reloadQuestionDetail();
        }
      };

      const handleColumnsChange = (record: Recordable) => {
        const rows = getSelectRows();
        if (rows.length > 0) {
          questionId.value = record.rows[0].id;
          reloadQuestionDetail();
        } else {
          questionId.value = '';
          reloadQuestionDetail();
        }
      };

      // 新增问题列表弹窗
      const handleCreateQuestion = () => {
        openAddQuestionModal(true, {
          canEdit: status.value === '99',
          isUpdate: false,
        });
      };

      // 新增问题列表事件
      async function handleAddQuestionSuccess({ isUpdate, values }) {
        const params = {
          ...values,
        };
        params.templateId = id.value;
        const res = await saveQuestionList(params);
        if (res) {
          notification.success({
            message: '操作成功',
            description: isUpdate ? `问题更新成功！` : `问题新增成功！`,
          });
          await reload();
        }
      }

      // 编辑问题列表
      function handleEditQuestion(record: Recordable) {
        openAddQuestionModal(true, {
          record,
          canEdit: status.value === '99',
          isUpdate: true,
        });
      }

      // 删除问题列表
      async function handleDeleteQuestion(record: Recordable) {
        const res = await deleteQuestionById({
          id: record.id,
        });
        if (res) {
          notification.success({
            message: '模板问题删除成功',
          });
          await reload();
          if (questionId.value === record.id) {
            questionId.value = '';
            await reloadQuestionDetail();
          }
        }
      }

      // 新增问题选项弹窗
      const handleCreateQuestionDetail = () => {
        if (!questionId.value) {
          createMessage.warning(`请先选择需要查看的问题`);
        } else {
          openAddQuestionDetailModal(true, {
            canEdit: status.value === '99',
            isUpdate: false,
          });
        }
      };

      // 新增问题选项事件
      async function handleAddQuestionDetailSuccess({ isUpdate, values }) {
        const params = {
          ...values,
        };
        params.templateId = id.value;
        params.questionId = questionId.value;
        const res = await saveQuestionDetail(params);
        if (res) {
          notification.success({
            message: '操作成功',
            description: isUpdate ? `问题选项更新成功！` : `问题选项新增成功！`,
          });
          await reloadQuestionDetail();
        }
      }

      // 编辑问题选项
      const handleEditQuestionDetail = (record: Recordable) => {
        openAddQuestionDetailModal(true, {
          record,
          canEdit: status.value === '99',
          isUpdate: true,
        });
      };

      // 删除问题选项
      async function handleDeleteQuestionDetail(record: Recordable) {
        const res = await deleteQuestionDetail({
          id: record.id,
        });
        if (res) {
          notification.success({
            message: '模板问题删除成功',
          });
          await reloadQuestionDetail();
        }
      }
      async function initPage () {
        const res = await getTemplateFindById({
          id: id.value,
        });
        if (res) {
          status.value = res.status
          await reload()
        }
      }
      initPage()
      return {
        searchInfo,
        handleRowClick,
        handleColumnsChange,
        registerQuestionTable,
        registerQuestionDetailTable,
        registerQuestionModal,
        registerQuestionDetailModal,
        handleCreateQuestion,
        handleCreateQuestionDetail,
        handleEditQuestion,
        handleEditQuestionDetail,
        handleDeleteQuestion,
        handleDeleteQuestionDetail,
        handleAddQuestionSuccess,
        handleAddQuestionDetailSuccess,
        status
      };
    },
  });
</script>
