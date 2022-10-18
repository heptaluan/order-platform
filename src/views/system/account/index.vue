<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" v-if="false"/>
<!--    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">-->
    <BasicTable @register="registerTable" class="w-4/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleUpload">导入登记员</a-button>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
            :actions="[
              // {
              //   icon: 'clarity:info-standard-line',
              //   label: '详情',
              //   tooltip: '查看用户详情',
              //   onClick: handleView.bind(null, record),
              // },
              {
                label: '编辑',
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '重置密码',
                icon: 'fluent:key-reset-20-filled',
                tooltip: '重置用户密码',
                onClick: handleReset.bind(null, record)
              }
              // {
              //   label: '删除',
              //   icon: 'ant-design:delete-outlined',
              //   color: 'error',
              //   tooltip: '删除此账号',
              //   popConfirm: {
              //     title: '是否确认删除',
              //     placement: 'left',
              //     confirm: handleDelete.bind(null, record),
              //   },
              // },
            ]"
          />
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountUploadModal @register="registerUploadModal" @success="handleSuccessUpload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {getAccountList, saveAccount, resetPassword} from '/@/api/base/base';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';

  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';
  import AccountUploadModal from "./AccountUploadModal.vue";

  import { columns, searchFormSchema } from './account.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  const templateUrl = 'https://rg.ananpan.com/uploads/template/%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
  // import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction, AccountUploadModal },
    setup() {
      // const go = useGo();
      const [registerModal, { openModal: openModal }] = useModal();
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { notification, createConfirm } = useMessage();

      const [registerTable, { reload }] = useTable({
        title: '账号列表',
        api: getAccountList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
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
        }
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

      function handleDelete(record: Recordable) {
        console.log(record);
      }
      async function handleReset(record: Recordable) {
        const { id } = record
        createConfirm({
          iconType: 'warning',
          title: '确认重置',
          content: '是否重置密码为默认密码?',
          onOk: async () => {
            const res = await resetPassword(id)
            if (res) {
              notification.success({
                message: '成功',
                description: res,
              })
            }
          },
          onCancel() {
            // console.log('Cancel');
          }
        });
      }

      async function handleSuccess({ isUpdate, values, isUserNameModify }) {
        const params = {
          ... values,
          roleIdList: Array.isArray(values.roleIdList) ? values.roleIdList : [values.roleIdList],
          realNameCn: values.nickName
        }
        // 新增
        if (!isUpdate) {
          // 清空id
          params.id = ''
          params.password = values.mobile
        }
        if (isUserNameModify) {
          createConfirm({
            iconType: 'warning',
            title: '提示',
            content: '修改用户名会重置密码，是否继续执行该操作?',
            onOk: async () => {
              const res = await saveAccount(params)
              if (res) {
                notification.success({
                  message: '保存成功',
                  description: isUpdate ? `帐号【${params.userName}】修改成功！` : `帐号【${params.userName}】新增成功！`,
                })
                await reload();
              }
            },
            onCancel() {
              // console.log('Cancel');
            }
          });
        } else {
          const res = await saveAccount(params)
          if (res) {
            notification.success({
              message: '保存成功',
              description: isUpdate ? `帐号【${params.userName}】修改成功！` : `帐号【${params.userName}】新增成功！`,
            })
            await reload();
          }
        }
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      // function handleView(record: Recordable) {
      //   go('/system/account_detail/' + record.id);
      // }
      function handleSuccessUpload({ message }) {
        console.log(message)
        notification.success({
          message: '导入成功',
          description: message,
        })
        reload()
      }
      function handleUpload() {
        openUploadModal(true, {
          downloadUrl: templateUrl
        })
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        searchInfo,
        handleReset,
        handleUpload,
        registerUploadModal,
        handleSuccessUpload
      };
    },
  });
</script>
