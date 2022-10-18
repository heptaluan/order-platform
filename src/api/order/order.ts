import { defHttp } from '/@/utils/http/axios';
import { ExportOrderResultModel, OrderListResultModel } from './model/baseModel';
import qs from 'qs'
import dayjs from 'dayjs'
import {UploadApiResult} from "/@/api/base/model/accountModel";

enum Api {
    Order_Export = '/tailai-cloud-register/register-count/findByDate',
    Order_Export_WJW = '/tailai-cloud-register/register-count/findByWJW',
    Order_List = '/tailai-cloud-register/register-record/findAllByDate',
    importOrder = '/api/tailai-cloud-register/register-record/importForEasyExcel',  // 上传走另外分支， 要带/api
}

/**
 * @description: Get sample list value
 */

export const getExportOrder = (params) => {
    let { date, dateTime } = params
    if (!date) {
        date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    } else {
        date = dayjs(date).format('YYYY-MM-DD') + ' ' + dayjs(dateTime).format('HH:mm:ss')
    }
    return defHttp.post<ExportOrderResultModel>({
        url: Api.Order_Export,
        data: qs.stringify({
            date: date
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const getExportOrderWJW = (params) => {
    let { rangeDate } = params
    const [registerDayBegin, registerDayEnd] = formatDateRange(rangeDate)
    return defHttp.post<ExportOrderResultModel>({
        url: Api.Order_Export_WJW,
        data: qs.stringify({
            dateBegin: registerDayBegin,
            dateEnd: registerDayEnd
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
/**
 * @description: Get sample list value
 */

export const getOrderList = (params) => {
    let { rangeDate, market } = params
    if (Array.isArray(market)) {
        params.marketId = market[0]
        params.placeId = market[1]
    }
    const [registerDayBegin, registerDayEnd] = formatDateRange(rangeDate)
    params.registerDayBegin = registerDayBegin
    params.registerDayEnd = registerDayEnd
    return defHttp.post<OrderListResultModel>({
        url: Api.Order_List,
        data: params
    });
}

const formatDateRange = (rangeDate)=> {
    let registerDayBegin = ''
    let registerDayEnd =''
    // 格式化
    if (!rangeDate) {
        registerDayBegin = dayjs().format('YYYY-MM-DD')
        registerDayEnd = dayjs().format('YYYY-MM-DD')
    } else {
        registerDayBegin = dayjs(rangeDate[0]).format('YYYY-MM-DD')
        registerDayEnd = dayjs(rangeDate[1]).format('YYYY-MM-DD')
    }
    return [registerDayBegin, registerDayEnd]
}

// 导入订单
export const importOrder = (params) => {
    return defHttp.uploadFile<UploadApiResult>(
      {
          url: Api.importOrder,
      },
      params,
    );
}
