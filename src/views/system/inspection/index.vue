<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
<!--      <template #toolbar>-->
<!--        <a-button type="primary" @click="handleExport">导出月巡检报表</a-button>-->
<!--      </template>-->
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { BasicTable,  useTable} from '/@/components/Table';
import { getOrderSummaryColumns, getFormConfigForExport } from './inspection.data';
import { getClockInByMonth } from "/@/api/base/base";
import { export_json_to_excel } from '/@/utils/xlsx/index'
import dayjs from "dayjs";

export default defineComponent({
  components: {BasicTable},
  setup() {
    const [registerTable, { getForm, getDataSource, setColumns }] = useTable({
      title: '月巡检报表',
      api: getClockInByMonth,
      columns: getOrderSummaryColumns(),
      useSearchForm: true,
      formConfig: getFormConfigForExport(),
      showTableSetting: true,
      bordered: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      afterFetch: () => {
        const FieldsValue = getForm().getFieldsValue()
        const days = dayjs(FieldsValue.clockInDate).daysInMonth()
        const Columns = getOrderSummaryColumns()
        for (let i = 0; i < Columns.length; i++) {
          const col = Columns[i]
          if (col.dataIndex?.indexOf('day') === -1) continue
          let day : string = (col.title as string)
          if (parseInt(day.replace('日', '')) > days) {
            col.ifShow = false
          }
        }
        setColumns(Columns)
      }
    });

    function handleExport() {
      const Columns = getOrderSummaryColumns()
      const fileNamePrefix = '订单统计表'
      exportExcel(Columns, fileNamePrefix)
    }
    function exportExcel(Columns, fileNamePrefix) {
      const rows = getDataSource()
      const FieldsValue = getForm().getFieldsValue()
      const date = FieldsValue.clockInDate || dayjs().format('YYYY-MM')
      const time = new Date(date)
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
      registerTable
    };
  },
});
</script>

