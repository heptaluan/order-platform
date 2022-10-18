<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <MarketTree class="w-1/4 xl:w-1/5" @select="handleSelect"></MarketTree>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">关联检测点</a-button>
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
                label: record.status === '01' ? '停用' : '启用',
                icon: record.status === '01' ? 'ant-design:stop-filled': 'bx:reset',
                tooltip: '停止使用',
                onClick: handleFreeze.bind(null, record)
              },
              {
                label: '二维码',
                icon: 'ion:qr-code-sharp',
                tooltip: '体检点二维码下载',
                onClick: handleQrCode.bind(null, record)
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
      <template #status="{ text }">
        <tag :color="text === '01' ? 'green' : 'grey'">{{text === '01' ? '启用' : '停用'}}</tag>
      </template>
    </BasicTable>
    <PlaceModal @register="registerModal" @success="handleSuccess"/>
    <QrCodeModal @register="registerQRModal" @success="handleQRSuccess"></QrCodeModal>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getPlaceByMarketId, savePlace, changeStatus } from '/@/api/base/base';
import { PageWrapper } from '/@/components/Page';
import MarketTree from './MarketTree.vue';
import { useModal } from '/@/components/Modal';
import PlaceModal from './PlaceModal.vue';
import { Tag } from 'ant-design-vue';
import QrCodeModal from './QrCodeModal.vue'


import { columns } from './place.data';
import { useMessage } from '/@/hooks/web/useMessage';

export default defineComponent({
  name: 'place',
  components: { BasicTable, PageWrapper, TableAction, MarketTree, PlaceModal, Tag, QrCodeModal },
  setup() {
    const [registerModal, { openModal: openModal }] = useModal();
    const [registerQRModal, { openModal: openQrModal }] = useModal();
    const searchInfo = reactive<Recordable>({});
    const { notification } = useMessage();

    const [registerTable, { reload }] = useTable({
      title: '账号列表',
      api: getPlaceByMarketId,
      rowKey: 'id',
      columns,
      // formConfig: {
      //   labelWidth: 120,
      //   schemas: searchFormSchema,
      //   autoSubmitOnEnter: true,
      // },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      pagination: { pageSize: 100 },
      handleSearchInfoFn(info) {
        return info;
      },
      immediate: false,
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

    async function handleSuccess({ isUpdate, values }) {
      const params = {
        ... values
      }
      const res = await savePlace(params)
      if (res) {
        notification.success({
          message: '保存成功',
          description: isUpdate ? `体检点【${params.placeName}】修改成功！` : `体检点【${params.placeName}】关联成功！`,
        })
        await reload();
      }
    }
    async function handleQRSuccess() {
      // todo something
    }
    function handleSelect({ marketId = '', marketName }) {
      searchInfo.marketId = marketId;
      searchInfo.marketName = marketName
      reload();
    }
    async function handleFreeze(record: Recordable) {
      const placeId = record.id
      const res = await changeStatus(placeId)
      if (res) {
        await reload();
      }
    }

    function handleQrCode(record: Recordable){
      openQrModal(true, {
        record,
        marketName: searchInfo.marketName,
      })
    }
    // function handleView(record: Recordable) {
    //   go('/system/account_detail/' + record.id);
    // }

    return {
      registerTable,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleSelect,
      searchInfo,
      handleFreeze,
      handleQrCode,
      registerQRModal,
      handleQRSuccess
    };
  },
});
</script>
