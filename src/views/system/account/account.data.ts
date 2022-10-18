import { getAllRoleList, getAllPlace } from '/@/api/base/base';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'roleNameList',
    width: 150,
    format: (text, record)=> {
      const { roleNameList } = record
      return text ? roleNameList.join(',') : ''
    }
  },
  {
    title: '联系方式',
    dataIndex: 'mobile',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    format: (text)=> {
      return dayjs(text).format('YYYY-MM-DD')
    }
  }
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'nickname',
  //   label: '昵称',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    helpMessage: ['不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      // {
      //   validator(_, value) {
      //     return new Promise((resolve, reject) => {
      //       isAccountExist(value)
      //         .then(() => resolve())
      //         .catch((err) => {
      //           reject(err.message || '验证失败');
      //         });
      //     });
      //   },
      // },
    ],
    // dynamicDisabled: true
    // componentProps: {
    //   onChange: (e: any) => {
    //     // console.log(e)
    //   }
    // }
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: false,
  },
  {
    label: '角色',
    field: 'roleIdList',
    component: 'ApiSelect',
    componentProps: ({ formModel,formActionType }) => {
      return {
        api: getAllRoleList,
        labelField: 'roleName',
        valueField: 'id',
        isRole: true,
        mode: 'multiple',
        onChange: (e: any) => {
          const { updateSchema } = formActionType;
          let showMarket = false
          // 如果选中 卫健委 清空其他选项
          if (e.includes('5')) {
            showMarket = true
            formModel.marketIdList = []
          }
          updateSchema({
            field: 'marketIdList',
            ifShow: showMarket,
            required: showMarket
          })
        },
      }
    },
    required: true,
  },
  {
    label: '所属区域',
    field: 'marketIdList',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPlace,
      labelField: 'marketName',
      valueField: 'id',
      mode: 'multiple',
      getPopupContainer: () => document.body,
    },
    ifShow: false
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    ifShow: false
    // required: true,
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },

  {
    label: '联系方式',
    field: 'mobile',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
