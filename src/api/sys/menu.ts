import {defHttp} from '/@/utils/http/axios';
import qs from 'qs';
import {getMenuListResultModel} from './model/menuModel';

enum Api {
  GetMenuList = '/tailai-cloud-system/sys-menu/queryPermsKeysByUserName',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (username) => {
  return defHttp.post<getMenuListResultModel>({
    url: Api.GetMenuList,
    data: qs.stringify(username),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};
