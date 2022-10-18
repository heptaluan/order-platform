import {BasicColumn, FormSchema} from "/@/components/Table";
import dayjs from "dayjs";
import { getAllPlace, getUnbindPlaces } from "/@/api/base/base";

export const columns: BasicColumn[] = [
    {
        title: '网点名',
        dataIndex: 'placeName',
        width: 120,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        slots: { customRender: 'status' },
        // format: (text)=> {
        //     const label = text === '01' ? '启用' : '停用'
        //     return label
        // }
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
        field: 'placeName',
        label: '检测点名称',
        component: 'Input',
        colProps: { span: 6 },
    }
];

export const placeFormSchema: FormSchema[] = [
    {
        field: 'id',
        label: '检测点Id',
        component: 'ApiSelect',
        componentProps: ({ formModel }) => {
            return {
                api: getUnbindPlaces,
                labelField: 'placeName',
                valueField: 'id',
                showSearch: true,
                onChange: (e: any, record) => {
                    formModel.id = e
                    formModel.placeName = record.label
                    formModel.mid = record.mid
                }
            }
        },
        show: false,
    },
    {
        field: 'placeName',
        label: '检测点名称',
        component: 'Input',
        rules: [
            {
                required: true,
                message: '请输入检测点名称',
            }
        ],
    },
    {
        field: 'mid',
        label: '渠道商Id',
        component: 'Input',
        show: false,
    },
    {
        label: '所属区域',
        field: 'marketId',
        component: 'ApiSelect',
        componentProps: {
            api: getAllPlace,
            labelField: 'marketName',
            valueField: 'id',
            getPopupContainer: () => document.body,
        },
        rules: [
            {
                required: true,
                message: '请选择所属区域',
            }
        ],
    },
    {
        field: 'latitude',
        label: '纬度',
        component: 'InputNumber',
        componentProps: {
            min: -90,
            max: 90,
            step: 0.00001
        }
    },
    {
        field: 'longitude',
        label: '经度',
        component: 'InputNumber',
        componentProps: {
            min: -180,
            max: 180,
            step: 0.00001
        }
    },
    {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
        ifShow: false,
    },
];
