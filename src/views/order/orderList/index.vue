<template>
  <div class="p-4">
    <BasicTable
        @register="registerTable">
      <template #form-custom>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleImport" v-if="isAdmin">导入订单</a-button>
        <a-button type="primary" @click="handleExport">导出订单明细</a-button>
      </template>
    </BasicTable>
    <order-import-modal @register="registerModal" @success="handleSuccessUpload"></order-import-modal>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, toRaw} from 'vue';
import { BasicTable,  useTable} from '/@/components/Table';
import { getOrderColumns, getFormConfigForList, getFormConfigForExportWJW } from './../tableData';
import { getOrderList } from '/@/api/order/order';
import { export_json_to_excel } from '/@/utils/xlsx/index'
import dayjs from "dayjs";
import {useUserStore} from "/@/store/modules/user";
import {useModal} from "/@/components/Modal";
import OrderImportModal from "/@/views/order/orderList/orderImportModal.vue";
import {useMessage} from "/@/hooks/web/useMessage";
const templateUrl = 'https://rg.ananpan.com/uploads/template/订单批量导入模版.xlsx'

export default defineComponent({
  components: {OrderImportModal, BasicTable},
  setup() {
    const checkedKeys = ref<Array<string | number>>([]);
    const userStore = useUserStore();
    const roleList = toRaw(userStore.getRoleList) || [];
    const hasHealthCommissionRole = roleList.some((role) => role === 'register')
    const isHealthCommissionRole = hasHealthCommissionRole && roleList.length === 1
    // 超级管理员或者租户管理员
    const isAdmin = roleList.some((role) => role === 'tenantAdmin' || role === 'superAdmin')
    const [registerModal, { openModal }] = useModal();
    const { notification } = useMessage();

    const [registerTable, { getForm, setLoading, reload }] = useTable({
      title: '渠道订单汇总',
      api: getOrderList,
      columns: getOrderColumns(),
      useSearchForm: true,
      formConfig: isHealthCommissionRole ? getFormConfigForExportWJW() : getFormConfigForList(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'id',
      pagination: { pageSize: 50 },
    });

    function getFormValues() {
      console.log(getForm().getFieldsValue());
    }

    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
    }
    function handleImport () {
      openModal(true, {
        downloadUrl: templateUrl
      })
    }
    function handleSuccessUpload({ message }) {
      notification.info({
        message: '导入提示',
        description: message,
      })
      reload()
    }
    async function handleExport() {
      try {
        setLoading(true)
        const FieldsValue = getForm().getFieldsValue()
        const {rangeDate, market, customerIdNumber, customerName, customerMobile, scode, orderId} = FieldsValue
        const params = {
          page: 1,
          size: 100000,
          rangeDate,
          market,
          customerIdNumber,
          customerName,
          customerMobile,
          scode,
          orderId
        }
        const res = await getOrderList(params)
        if (res && res.list) {
          exportExcel(res.list, '订单明细导出')
        }
      }
      catch (e) {
        setLoading(false)
        console.log(e)
      }
    }
    function exportExcel(rows, fileNamePrefix) {
      const Columns = getOrderColumns()
      const FieldsValue = getForm().getFieldsValue()
      const date = FieldsValue.rangeDate.join('  ~  ') || dayjs().format('YYYY-MM-DD')
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
      export_json_to_excel(params as never)
      setLoading(false)
    }

    return {
      handleExport,
      registerTable,
      getFormValues,
      checkedKeys,
      onSelectChange,
      handleImport,
      isAdmin,
      registerModal,
      handleSuccessUpload
    };
  },
});
</script>

