import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import {getAllPlace, getDictByCode} from "/@/api/base/base";
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import moment from 'moment';

export function getOrderColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      width: 200,
      dataIndex: 'marketName'
    },
    {
      title: '网点名',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '工作单位',
      width: 180,
      dataIndex: 'customerCompany'
    },
    {
      title: '姓名',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '年龄',
      dataIndex: 'customerAge',
      width: 60,
    },
    {
      title: '性别',
      dataIndex: 'customerSexCn',
      width: 60,
    },
    {
      title: '身份证',
      dataIndex: 'customerIdNumber',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'customerMobile',
      width: 120,
    },
    {
      title: '液体活检编号',
      dataIndex: 'scode',
      width: 120,
    },
    {
      title: '居住地',
      dataIndex: 'customerAddress',
      width: 180,
    },
    {
      title: '创建订单时间',
      width: 180,
      sorter: true,
      dataIndex: 'createTime',
    },
    {
      title: '订单状态',
      width: 80,
      dataIndex: 'orderStatusName',
    },
    {
      title: '登记员',
      width: 120,
      sorter: true,
      dataIndex: 'createByName',
    },
    {
      title: '订单来源',
      width: 100,
      dataIndex: 'registerTypeName',
    }
  ];
}
export function getOrderSummaryColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      width: 200,
      dataIndex: 'marketName'
    },
    {
      title: '定点医疗机构',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '登记人数',
      dataIndex: 'registerNum',
      width: 100,
    },
    {
      title: '登记员',
      dataIndex: 'registerNames',
    },
    {
      title: '登记日期',
      width: 180,
      sorter: true,
      dataIndex: 'registerDay',
    },
    {
      title: '核对样本数',
      dataIndex: 'confirmNum',
      width: 120,
    },
    {
      title: '收样员',
      dataIndex: 'confirmName',
      width: 120,
    }
  ];
}
export function getOrderSummaryWJWColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      width: 200,
      dataIndex: 'marketName'
    },
    {
      title: '定点医疗机构',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '登记人数',
      dataIndex: 'registerNum',
      width: 100,
    },
    {
      title: '登记员',
      dataIndex: 'registerNames',
    }
  ];
}
export function getOrderExportColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      dataIndex: 'marketName'
    },
    {
      title: '定点医疗机构',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '登记人数',
      dataIndex: 'registerNum',
      width: 100,
    },
    {
      title: '登记员',
      dataIndex: 'registerNames',
      width: 100,
    }
  ];
}
// 快递取样表
export function getExpressExportColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      dataIndex: 'marketName'
    },
    {
      title: '定点医疗机构',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '预计取样数',
      dataIndex: 'registerNum',
      width: 100
    },
  ];
}
// 实际取样表
export function getOrderConfirmExportColumns(): BasicColumn[] {
  return [
    {
      title: '县（市）、区',
      dataIndex: 'marketName'
    },
    {
      title: '定点医疗机构',
      dataIndex: 'placeName',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '登记人数',
      dataIndex: 'registerNum',
      width: 100,
    },
    {
      title: '登记员',
      dataIndex: 'registerNames',
      width: 100,
    },
    {
      title: '次日核对样本数',
      dataIndex: 'confirmNum',
      width: 80,
    },
    {
      title: '收样员',
      dataIndex: 'confirmName',
      width: 100,
    }
  ];
}
const renderContent = ({ text, index }: { text: any; index: number }) => {
  const obj: any = {
    children: text,
    attrs: {},
  };
  if (index === 9) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customRender: ({ text, index }: { text: any; index: number }) => {
        const obj: any = {
          children: text,
          attrs: {},
        };
        if (index === 2) {
          obj.attrs.rowSpan = 2;
        }
        if (index === 3) {
          obj.attrs.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customRender: renderContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customRender: renderContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customRender: renderContent,
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};
export function getFormConfigForExportWJW(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'rangeDate',
        label: `登记日期`,
        component: 'RangePicker',
        defaultValue: [new Date(), new Date()],
        componentProps: {
          format: 'YYYY-MM-DD',
          allowClear: false,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        }
      }
    ],
  };
}
export function getFormConfigForExport(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `date`,
        label: `登记日期`,
        component: 'DatePicker',
        defaultValue: moment(new Date(), 'YYYY-MM-DD'),
        componentProps: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          allowClear: false,
        },
        colProps: {
          style: 'max-width: 240px;',
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `dateTime`,
        label: ``,
        component: 'TimePicker',
        defaultValue: moment(new Date(), 'HH:mm:ss'),
        componentProps: {
          format: 'HH:mm:ss',
          allowClear: false,
        },
        colProps: {
          xl: 6,
          xxl: 3,
        }
      },
    ],
  };
}
export function getFormConfigForList(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        // field: `[registerDayBegin, registerDayEnd]`,
        field: `rangeDate`,
        label: `登记日期`,
        component: 'RangePicker',
        defaultValue: [moment(), moment()],
        componentProps: {
          format: 'YYYY-MM-DD',
          allowClear: false,
          locale,
          ranges: {
            '近一周': [moment().subtract(1, 'week'), moment()],
            '近一月': [moment().subtract(1, 'month'), moment()],
            '近一年': [moment().subtract(1, 'year'), moment()]
          },
          getPopupContainer: () => document.body,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `market`,
        label: `检测点`,
        component: 'ApiCascaderMarket',
        componentProps: {
          labelField: 'marketName',
          valueField: 'id',
          childrenField: 'registerMarketPlaceVOList',
          api: getAllPlace,
          isLeaf: (item) =>{
            return !item.registerMarketPlaceVOList
          },
          showSearch: true,
          changeOnSelect: true,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `customerIdNumber`,
        label: `身份证`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `customerName`,
        label: `姓名`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `customerMobile`,
        label: `手机号`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `scode`,
        label: `液体活检编号`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `orderId`,
        label: `订单编号`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `orderStatus`,
        label: `订单状态`,
        component: 'ApiSelect',
        componentProps: {
          api: getDictByCode,
          params: {
            type: 'reg_order_type'
          },
          labelField: 'dictLabel',
          valueField: 'dictValue',
          getPopupContainer: () => document.body,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        }
      }
    ],
  };
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}

export const importFormSchema: FormSchema[] = [
  {
    field: `market`,
    label: `检测点:`,
    component: 'ApiCascaderMarket',
    componentProps: {
      labelField: 'marketName',
      valueField: 'id',
      childrenField: 'registerMarketPlaceVOList',
      api: getAllPlace,
      isLeaf: (item) =>{
        return !item.registerMarketPlaceVOList
      },
      showSearch: true,
      changeOnSelect: false,
      getPopupContainer: () => document.body,
    },
    colProps: {
      xl: 24,
      xxl: 24,
    },
    required: true
  },
];
