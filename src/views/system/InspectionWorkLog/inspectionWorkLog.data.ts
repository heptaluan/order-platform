import {BasicColumn, FormProps, FormSchema} from "/@/components/Table";
import moment from "moment";
import {getAllPlace} from "/@/api/base/base";

export function getOrderSummaryColumns(): BasicColumn[] {
  return [
    {
      title: '打卡日期',
      width: 120,
      sorter: true,
      dataIndex: 'clockInDate',
    },
    {
      title: '问题描述',
      dataIndex: 'problem',
      sortOrder: 'ascend',
    },
    {
      title: '解决方案',
      dataIndex: 'solution',
    },
    {
      title: '巡检员',
      dataIndex: 'userName',
      width: 120,
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      width: 100,
    }
  ];
}
export function getFormConfigForExport(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `clockInDate`,
        label: `打卡日期`,
        component: 'DatePicker',
        defaultValue: moment(new Date(), 'YYYY-MM-DD'),
        componentProps: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          allowClear: false,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        }
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
          changeOnSelect: false,
        },
        colProps: {
          xl: 6,
          xxl: 4,
        }
      },
      {
        field: `userName`,
        label: `姓名`,
        component: 'Input',
        colProps: {
          xl: 6,
          xxl: 4,
        }
      }
    ],
  };
}

export const WorkLogFormSchema: FormSchema[] = [
  {
    field: 'problem',
    label: '问题：',
    component: 'InputTextArea',
    dynamicDisabled: true,
    componentProps: {
      autosize: { minRows: 2, maxRows: 6 }
    },
  },
  {
    field: 'solution',
    label: '解决方案：',
    component: 'InputTextArea',
    dynamicDisabled: true,
    componentProps: {
      autosize: { minRows: 2, maxRows: 6 }
    },
  },
  {
    field: 'appendixVOList',
    label: '附件：',
    component: 'ImageList',
    componentProps: {
      urlField: 'fileUrl'
    },
    colProps: {
      style: 'min-height: 240px;',
    }
  },
];
