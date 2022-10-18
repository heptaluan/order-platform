import { getCodeType, getAllEnabled } from '/@/api/base/question';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getAllPlace } from '/@/api/base/base';
import dayjs from 'dayjs';

// 问卷模板
export const templateColumns: BasicColumn[] = [
  {
    title: '问卷编码',
    dataIndex: 'templateCode',
    width: 120,
  },
  {
    title: '问卷标题',
    dataIndex: 'questionnaireTitle',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'questionnaireRemark',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    format: (text) => {
      return dayjs(text).format('YYYY-MM-DD');
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
    format: (text) => {
      return text ? dayjs(text).format('YYYY-MM-DD') : '-';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slots: { customRender: 'status' },
  },
  {
    title: '版本号',
    dataIndex: 'templateVersion',
    width: 100,
  },
];

// 问卷模板搜索
export const templateFormSchema: FormSchema[] = [
  {
    field: 'questionnaireTitle',
    label: '问卷标题',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入问卷标题',
    },
  },
];

// 新增问题模板弹窗
export const addTemplateFormSchema: FormSchema[] = [
  {
    field: 'templateCode',
    label: '问卷编码',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入问卷编码',
      },
    ],
  },
  {
    field: 'questionnaireTitle',
    label: '问卷标题',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入问卷标题',
      },
    ],
    componentProps: {
      placeholder: '请输入问卷标题',
    },
  },
  {
    field: 'informedConsent',
    label: '知情同意书',
    component: 'Input',
    defaultValue: '',
    required: true,
    slot: 'informedConsentSlot',
  },
  {
    field: 'statement',
    label: '声明',
    component: 'Input',
    defaultValue: '',
    required: true,
    slot: 'statementSlot',
  },
  {
    field: 'questionnaireRemark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注内容',
      rows: 4,
    },
  },
];

// ===============================

// 问卷列表
export const questionList: BasicColumn[] = [
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 120,
    format: (text) => {
      return dayjs(text).format('YYYY-MM-DD');
    },
  },
  {
    title: '姓名',
    dataIndex: 'nameCn',
    width: 120,
  },
  {
    title: '性别',
    dataIndex: 'sexCn',
    width: 120,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 180,
  },
  {
    title: '是否患癌',
    dataIndex: 'hasTumourCn',
    width: 120,
  },
  {
    title: '现居住地',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '所在单位',
    dataIndex: 'company',
    width: 120,
  },
  {
    title: '证件类型',
    dataIndex: 'idCardTypeCn',
    width: 120,
  },
  {
    title: '证件号码',
    dataIndex: 'idCardNumber',
    width: 180,
  },
];

// 问题列表搜索
export const questionListFormSchema: FormSchema[] = [
  {
    field: 'itemTitle',
    label: '姓名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名',
    },
    colProps: {
      xl: 6,
      xxl: 4,
    },
  },
  {
    field: 'rangeDate',
    label: `下单时间`,
    component: 'RangePicker',
    defaultValue: [new Date(), new Date()],
    componentProps: {
      format: 'YYYY-MM-DD',
      allowClear: true,
    },
    colProps: {
      xl: 8,
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
      isLeaf: (item) => {
        return !item.registerMarketPlaceVOList;
      },
      showSearch: true,
      changeOnSelect: true,
    },
    colProps: {
      xl: 8,
      xxl: 4,
    },
  },
  {
    field: 'templateId',
    label: '问卷模板',
    component: 'ApiSelect',
    componentProps: ({ formActionType, tableAction, formModel }) => {
      return {
        api: getAllEnabled,
        labelField: 'questionnaireTitle',
        valueField: 'id',
        isRole: true,
        placeholder: '请选择问题类型',
        onOptionsChange: (res) => {
          const { updateSchema } = formActionType;
          const { reload } = tableAction;
          updateSchema({
            field: 'questionnaireTitle',
            defaultValue: res[0].questionnaireTitle,
          });
          formModel.templateId = res[0].value;
          reload();
        },
      };
    },
    colProps: {
      xl: 6,
      xxl: 4,
    },
    required: true,
  },
];

// 问题列表编辑
export const questionListEditFormSchema: FormSchema[] = [
  {
    field: 'templateCode',
    label: '问卷标题',
    component: 'Input',
    show: false,
  },
  {
    field: 'questionnaireTitle',
    label: '问卷标题',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入问卷标题',
      },
    ],
    componentProps: {
      placeholder: '请输入问卷标题',
    },
  },
  {
    field: 'informedConsent',
    label: '知情同意书',
    component: 'Input',
    defaultValue: '',
    required: true,
    slot: 'informedConsentSlot',
  },
  {
    field: 'statement',
    label: '声明',
    component: 'Input',
    defaultValue: '',
    required: true,
    slot: 'statementSlot',
  },
  {
    field: 'questionnaireRemark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注内容',
      rows: 4,
    },
  },
];

// ===============================

// 问题列表
export const questionColumns: BasicColumn[] = [
  {
    title: '问题标题',
    dataIndex: 'questionTitle',
    width: 120,
  },
  {
    title: '问题描述',
    dataIndex: 'questionDescribe',
    width: 120,
  },
  {
    title: '问题类型',
    dataIndex: 'questionTypeName',
    width: 120,
  },
  {
    title: '排序号',
    dataIndex: 'orderNum',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'questionRemark',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    format: (text) => {
      return dayjs(text).format('YYYY-MM-DD');
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
    format: (text) => {
      return text ? dayjs(text).format('YYYY-MM-DD') : '-';
    },
  },
];

// 问题列表搜索
export const questionFormSchema: FormSchema[] = [
  {
    field: 'questionTitle',
    label: '问题标题',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入问题标题',
    },
  },
];

// 新增问题列表弹窗
export const addQuestionFormSchema: FormSchema[] = [
  {
    field: 'questionTitle',
    label: '问题标题',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入问题标题',
      },
    ],
    componentProps: {
      placeholder: '请输入问题标题',
    },
  },
  {
    field: 'questionDescribe',
    label: '问题描述',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入问题描述',
      },
    ],
    componentProps: {
      placeholder: '请输入问题描述',
    },
  },
  {
    field: 'questionType',
    label: '问题类型',
    component: 'ApiSelect',
    componentProps: () => {
      return {
        api: getCodeType,
        params: {
          type: 'que_subject_type',
        },
        labelField: 'dictLabel',
        valueField: 'dictValue',
        isRole: true,
        placeholder: '请选择问题类型',
      };
    },
    required: true,
  },
  {
    field: 'orderNum',
    label: '排序',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入排序号',
    },
    required: true,
  },
  {
    field: 'questionRemark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      rows: 4,
      placeholder: '请输入备注',
    },
  },
];

// ===============================

// 问题选项列表
export const questionDetailColumns: BasicColumn[] = [
  {
    title: '选项标题',
    dataIndex: 'itemTitle',
    fixed: 'left',
    width: 120,
  },
  {
    title: '选项描述',
    dataIndex: 'itemDescribe',
    fixed: 'left',
    width: 120,
  },
  // {
  //   title: '选项值',
  //   dataIndex: 'itemValue',
  //   width: 120,
  // },
  {
    title: '是否有备注栏',
    dataIndex: 'hasRemarkCn',
    width: 120,
  },
  {
    title: '是否排它选项',
    dataIndex: 'isExclusiveCn',
    width: 120,
  },
  {
    title: '排序号',
    dataIndex: 'orderNum',
    width: 120,
  },
  // {
  //   title: '备注',
  //   dataIndex: 'questionRemark',
  //   width: 120,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 180,
  //   format: (text) => {
  //     return dayjs(text).format('YYYY-MM-DD');
  //   },
  // },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
    format: (text) => {
      return text ? dayjs(text).format('YYYY-MM-DD') : '-';
    },
  },
];

// 问题选项搜索
export const questionDetailFormSchema: FormSchema[] = [
  {
    field: 'itemTitle',
    label: '选项标题',
    component: 'Input',
    colProps: { span: 12 },
    componentProps: {
      placeholder: '请输入选项标题',
    },
  },
];

// 新增问题选项弹窗
export const addQuestionDetailFormSchema: FormSchema[] = [
  {
    field: 'itemTitle',
    label: '选项标题',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入选项标题',
      },
    ],
    componentProps: {
      placeholder: '请输入选项标题',
    },
  },
  {
    field: 'itemDescribe',
    label: '选项描述',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入选项描述',
      },
    ],
    componentProps: {
      placeholder: '请输入选项描述',
    },
  },
  {
    field: 'itemValue',
    label: '选项值',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入选项值',
      },
    ],
    componentProps: {
      placeholder: '请输入选项值',
    },
  },
  {
    field: 'hasRemark',
    label: '是否有备注栏',
    component: 'ApiSelect',
    componentProps: () => {
      return {
        api: getCodeType,
        params: {
          type: 'sys_yes_no',
        },
        labelField: 'dictLabel',
        valueField: 'dictValue',
        isRole: true,
        placeholder: '请选择是否有备注栏',
      };
    },
    required: true,
  },
  {
    field: 'isExclusive',
    label: '是否排它选项',
    component: 'ApiSelect',
    componentProps: () => {
      return {
        api: getCodeType,
        params: {
          type: 'sys_yes_no',
        },
        labelField: 'dictLabel',
        valueField: 'dictValue',
        isRole: true,
        placeholder: '请选择是否排它选项',
      };
    },
    required: true,
  },
  {
    field: 'orderNum',
    label: '排序',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入排序号',
    },
    required: true,
  },
  {
    field: 'questionRemark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      rows: 4,
      placeholder: '请输入备注',
    },
  },
];
