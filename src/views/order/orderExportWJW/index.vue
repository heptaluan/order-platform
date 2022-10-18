<template>
  <div class="p-4">
    <BasicTable
        @register="registerTable"
        :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys, onChange: onSelectChange }"
    >
      <template #form-custom>
      </template>
      <template #headerTop>
        <a-alert type="info" show-icon v-if="checkedKeys.length > 0">
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录</span>
              <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出订单统计表</a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BasicTable,  useTable} from '/@/components/Table';
import {
  getFormConfigForExportWJW,
  getOrderSummaryWJWColumns,
} from './../tableData';
import { getExportOrderWJW } from '/@/api/order/order';
import { export_json_to_excel } from '/@/utils/xlsx/index'
import AButton from "/@/components/Button/src/BasicButton.vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {AButton, BasicTable},
  setup() {
    const checkedKeys = ref<Array<string | number>>([]);
    const [registerTable, { getForm, getSelectRows }] = useTable({
      title: '渠道订单汇总',
      api: getExportOrderWJW,
      columns: getOrderSummaryWJWColumns(),
      useSearchForm: true,
      formConfig: getFormConfigForExportWJW(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'placeId',
      pagination: { pageSize: 100000 }
    });

    function getFormValues() {
      console.log(getForm().getFieldsValue());
    }

    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
    }
    function handleExport() {
      if (checkedKeys.value.length === 0) {
        return false
      }
      const Columns = getOrderSummaryWJWColumns()
      const fileNamePrefix = '订单统计表'
      exportExcel(Columns, fileNamePrefix)
    }
    function exportExcel(Columns, fileNamePrefix) {
      const rows = getSelectRows()
      const FieldsValue = getForm().getFieldsValue()
      const date = FieldsValue.rangeDate.join(' ~ ') || dayjs().format('YYYY-MM-DD')
      const time = new Date()
      const fileName = fileNamePrefix + time.getFullYear() + (time.getMonth() + 1) + time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds()
      const params = {
        data: [],
        key: Columns.map(item => item.dataIndex),
        filename: fileName,
        autoWidth: true,
        title: {},
        date
      }
      for (let j = 0; j < rows.length; j++) {
        let row = rows[j]
        const _row = {}
        for (let k in params.key) {
          let _key = params.key[k]
          if (_key) _row[_key] = row[_key]
        }
        params.data.push(_row as never)
      }
      // 组织title
      const title = {}
      for (let i in params.key) {
        let _key = params.key[i]
        let col = Columns.find(o => o.dataIndex === _key)
        if (col && _key) {
          title[_key] = col.title
        }
      }
      params.title = title
      export_json_to_excel(params)
    }
    return {
      handleExport,
      registerTable,
      getFormValues,
      checkedKeys,
      onSelectChange
    };
  },
});
</script>

