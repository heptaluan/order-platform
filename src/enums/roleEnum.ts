export enum RoleEnum {
// 1 super admin
// 2 登记员 register
// 3 租户管理员 tenantAdmin
// 4 收样员 receiver
// 5 卫健委人员 healthCommission
  SUPER = 'superAdmin',
  // 采样员
  SAMPLER = 'register',
  // 操作员
  OPERATOR = 'tenantAdmin',
  // 收样员
  SAMPLE_COLLECTOR = 'receiver',
  // 卫健委人员
  HEALTH_COMMISSION = 'healthCommission',
  // tester
  TEST = 'test'
}
