/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha: string;
  checkKey: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  id: string | number;
  // 默认主页
  homePath: string;
  //角色列表
  roleList: Array<string>;

  roleIdList: Array<string>;

  roleKeyList: Array<string>;

  roles: RoleInfo[];
  // 用户名
  userName: string;
  // 真实名字
  nickName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // token
  token: string;
  // 部门
  deptId: string
}
