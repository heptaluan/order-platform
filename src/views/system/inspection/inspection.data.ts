import {BasicColumn, FormProps} from "/@/components/Table";
import moment from "moment";
import {getAllPlace} from "/@/api/base/base";

export function getOrderSummaryColumns(): BasicColumn[] {
  const arr: any =  [
    {
      title: '巡检员',
      dataIndex: 'userName',
      sorter: true,
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '县（市）、区',
      dataIndex: 'registerMarketName',
      sorter: true,
      sortOrder: 'ascend',
      width: 150,
    },
    {
      title: '巡检点',
      dataIndex: 'registerPlaceName',
      sorter: true,
      sortOrder: 'ascend',
      width: 180,
    },
  ];
  for (let i = 0; i < 31; i++) {
    let day = i + 1
    let dayText = day > 9 ? day : '0' + day
    const column =  {
        title: day + '日',
        dataIndex: 'day' + dayText,
        children: [
          {
            title: '上班打卡',
            dataIndex: 'clockInStartTime' + dayText,
            width: 80,
          },
          {
            title: '下班打卡',
            dataIndex: 'clockInEndTime' + dayText,
            width: 80,
          },
        ],
      }
    arr.push(column)
  }
  return  arr
}

export function getFormConfigForExport(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `clockInDate`,
        label: `打卡日期`,
        component: 'MonthPicker',
        defaultValue: moment(new Date(), 'YYYY-MM'),
        componentProps: ({ tableAction, formModel }) => {
          return {
            format: 'YYYY-MM',
            valueFormat: 'YYYY-MM',
            allowClear: false,
            onChange: (value)=>{
              formModel.clockInDate = value
              const { reload }= tableAction
              reload();
            }
          }
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
