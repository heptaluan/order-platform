<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
            :actions="[
              {
                label: '详情',
                icon: 'clarity:note-edit-line',
                tooltip: '查看工作日志',
                onClick: handleView.bind(null, record),
              }
            ]"
        />
      </template>
    </BasicTable>
    <WorkLogModal @register="registerModal" @success="handleSuccess"/>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { BasicTable,  useTable, TableAction} from '/@/components/Table';
import {
  getOrderSummaryColumns,
  getFormConfigForExport,
} from './inspectionWorkLog.data';
import {getWorkLogList, getWorkLogById} from "/@/api/base/base";
import WorkLogModal from "/@/views/system/InspectionWorkLog/WorkLogModal.vue";
import {useModal} from "/@/components/Modal";

export default defineComponent({
  components: {WorkLogModal, BasicTable, TableAction},
  setup() {
    const [registerTable, { }] = useTable({
      title: '巡检工作日志列表',
      api: getWorkLogList,
      columns: getOrderSummaryColumns(),
      useSearchForm: true,
      formConfig: getFormConfigForExport(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'id',
      actionColumn: {
        width: 180,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      }
    });
    const [registerModal, { openModal }] = useModal();
    async function handleView (record) {
      const response = await getWorkLogById(record.id)
      openModal(true, {
        record: response
      });
    }
    async function handleSuccess({ }) {

    }
    return {
      registerTable,
      handleView,
      registerModal,
      handleSuccess
    };
  },
});
</script>

