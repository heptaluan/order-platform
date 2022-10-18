import { defHttp } from '/@/utils/http/axios';
import {
    AccountItem,
    AccountListResultModel,
    BaseResultModel,
    DepTreeResultModel, marketResultModel,
    RoleResultModel,
    UploadApiResult
} from "/@/api/base/model/accountModel";
import qs from 'qs'
import dayjs from "dayjs";

enum Api {
    Account_List = '/tailai-cloud-system/sys-user/list',
    deptTree = '/tailai-cloud-system/sys-dept/getDeptTree',
    queryAllRoles = '/tailai-cloud-system/sys-role/queryAllRoles',
    changePassword = '/tailai-cloud-system/sys-user/changePassword',
    saveAccount = '/tailai-cloud-system/sys-user/saveUser',
    getAllPlace = '/tailai-cloud-register/register-market/findAllByWeb',
    resetPassword = '/tailai-cloud-system/sys-user/resetPassword',
    importUsers = '/api/tailai-cloud-system/sys-user/importUsers',  // 上传走另外分支， 要带/api
    getPlaceByMarketId = '/tailai-cloud-register/register-market-place/findByMarketId',
    getUnbindPlaces = '/tailai-cloud-register/register-market-place/findUnbindPlaces',
    savePlace = '/tailai-cloud-register/register-market-place/save',
    changeStatus = '/tailai-cloud-register/register-market-place/switchStatus',
    getDictByCode = '/tailai-cloud-system/sys-dict-item/getItemsByType',
    getWorkLogList = '/tailai-cloud-register/register-problem/findBySearchDTO',
    getWorkLogById = '/tailai-cloud-register/register-problem/getDetailsById',
    getClockInByMonth ='/tailai-cloud-register/register-clock-in/queryMonth'
}

/**
 * @description: Get sample list value
 */
export const getAccountList = (params) => {
    return defHttp.post<AccountListResultModel>({
        url: Api.Account_List,
        data: params,
    });
}
export const saveAccount = (params) =>{
    return defHttp.post<AccountItem>({
        url: Api.saveAccount,
        data: params,
    });
}
export const getDeptList = () => {
    return defHttp.post<DepTreeResultModel>({
        url: Api.deptTree
    });
}

export const getAllRoleList = ()=>{
    return defHttp.post<RoleResultModel>({
        url: Api.queryAllRoles
    });
}

export const setRoleStatus = (id, status)=>{
    return defHttp.post<RoleResultModel>({
        url: Api.queryAllRoles,
        data: {
            id,
            status
        }
    });
}
// 密码相关
// 修改密码
export const modifyPassword = (params)=>{
    return defHttp.post<BaseResultModel>({
        url: Api.changePassword,
        data: params
    });
}
// 重置密码
export const resetPassword = (userId)=>{
    return defHttp.post<BaseResultModel>({
        url: Api.resetPassword,
        data: qs.stringify({
            userId
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const getMenuList = ()=>{
    return defHttp.post<RoleResultModel>({
        url: Api.queryAllRoles
    });
}
// 检测点
export const getAllPlace = ()=> {
    return defHttp.post<marketResultModel>({
        url: Api.getAllPlace
    });
}
export const getPlaceByMarketId = (params)=> {
    const { marketId } = params
    return defHttp.post<marketResultModel>({
        url: Api.getPlaceByMarketId,
        data: qs.stringify({
            marketId: marketId
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const getUnbindPlaces = ()=> {
    return defHttp.post<marketResultModel>({
        url: Api.getUnbindPlaces
    });
}
export const changeStatus =(placeId) => {
    return defHttp.post<marketResultModel>({
        url: Api.changeStatus,
        data: qs.stringify({
            placeId
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
// 检测点
export const savePlace = (data)=> {
    return defHttp.post<marketResultModel>({
        url: Api.savePlace,
        data
    });
}
export const getClockInByMonth = (data)=>{
    let { clockInDate, market } = data
    if (!clockInDate) {
        clockInDate = dayjs().format('YYYY-MM')
    } else {
        clockInDate = dayjs(clockInDate).format('YYYY-MM')
    }
    if (Array.isArray(market)) {
        data.registerPlaceId = market[1]
    }
    data.month = clockInDate
    return defHttp.post<BaseResultModel>({
        url: Api.getClockInByMonth,
        data
    });
}
export const getWorkLogList = (data)=>{
    let { clockInDate, market } = data
    if (!clockInDate) {
        clockInDate = dayjs().format('YYYY-MM-DD')
    } else {
        clockInDate = dayjs(clockInDate).format('YYYY-MM-DD')
    }
    if (Array.isArray(market)) {
        data.registerPlaceId = market[1]
    }
    data.clockInDate = clockInDate
    return defHttp.post<BaseResultModel>({
        url: Api.getWorkLogList,
        data
    });
}
export const getWorkLogById = (id)=>{
    return defHttp.post<marketResultModel>({
        url: Api.getWorkLogById,
        data: qs.stringify({
            id
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
// 导入用户
export const importUsers = (params) => {
    return defHttp.uploadFile<UploadApiResult>(
        {
            url: Api.importUsers,
        },
        params,
    );
}
// 根据code 获取字典
export const getDictByCode = (params)=> {
    const { type } = params
    return defHttp.post<marketResultModel>({
        url: Api.getDictByCode,
        data: qs.stringify({
            type: type
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
