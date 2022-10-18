import {BasicFetchResult} from '/@/api/order/model/baseModel';

export interface AccountItem {
  id: string | number;
  //角色列表
  roleIdList: Array<string>;
  roleNameList: Array<string>;
  // 用户名
  userName: string;
  // 真实名字
  nickName: string;
  // realNameCn	中文名	string
  realNameCn: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // token
  token: string;
  // 部门
  deptId: string;
  // openId	openId	string
  openId: string;
  //loginDate
  loginDate: string;
  // delFlag
  delFlag: String;
}
export interface DeptTree {
  // id	部门id	string
  id: string;
  // children	子部门	array	SysDeptVO对象
  children: Array<DeptTree>;
  // createBy	创建者	string
  createBy: string;
  // createTime	创建时间	string(date-time)
  createTime: string;
  // delFlag	删除标志（字典 sys_del_flag）	string
  delFlag: string;
  // deptName	部门名称	string
  deptName: string;
  // email	邮箱	string
  email: string;
  // leader	负责人	string
  leader: string;
  // orderNum	显示顺序	integer(int32)
  orderNum: string;
  // parentId	父部门id	string
  parentId: string;
  // phone	联系电话	string
  phone: string;
  // status	部门状态（字典 sys_enable_status）	string
  status: string;
  // updateBy	更新者	string
  updateBy: string;
  // updateTime	更新时间,
  updateTime: string;
}
export interface Role  {
// createBy	创建者	string
  createBy: string;
// createTime	创建时间	string(date-time)
  createTime: string;
// dataScope	数据范围（字典:sys_data_scope）	string
  dataScope: string;
// delFlag	删除标志（字典:sys_del_flag）	string
  delFlag: string;
// id	角色ID	string
  id: string;
// roleKey	角色权限字符串	string
  roleKey: string;
// roleName	角色名称	string
  roleName: string;
// roleSort	显示顺序	integer(int32)
  roleSort: string;
// status	角色状态（字典:sys_enable_status）	string
  status: string;
// updateBy	更新者	string
  updateBy: string;
// updateTime
  updateTime: string;
}
export interface Base {

}
export interface marketItem {
  id: string;
  marketName: string;
  registerMarketPlaceVOList: Array<marketItem>;
  placeName: string;
  marketId: string;
}
export interface UploadApiResult {
  message: string;
  code: number;
  url: string;
  data: string | object
}

export type AccountListResultModel = BasicFetchResult<AccountItem>;
export type DepTreeResultModel = DeptTree[];
export type RoleResultModel = Role[];
export type BaseResultModel = Base;
export type marketResultModel = marketItem[]
