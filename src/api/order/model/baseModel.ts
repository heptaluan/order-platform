export interface BasicFetchResult<T> {
    list: T[];
    total: number;
    page: number;
    size: number;
}

export interface ListItem {
    // id	主键id	string
    id: string;
    // marketId	渠道商id	string
    marketId: string;
    // marketName	渠道商名称	string
    marketName: string;
    // placeId	检测点id	string
    placeId: string;
    // placeName	检测点名称	string
    placeName: string;
    // registerDay	登记日期	string
    registerDay: string;
    // registerNum	登记人数	integer(int32)
    num: number;
    // confirmNum	确认人数	integer(int32)
    confirmNum: number;
    // isVerify	是否核实(字典:sys_yes_no)	string
    isVerify: string;
    // verifyBy	核实人(微信openid)	string
    verifyBy: string;
    // verifyTime
    verifyTime: string;
    // createBy	创建者	string
    createBy: string;
    // createTime	创建时间	string(date-time)
    createTime: string;
    // tenantId	租户id	string
    tenantId: string;
    // updateBy	更新者	string
    updateBy: string;
    // updateTime	更新时间	string(date-time)
    updateTime: string;
}
export interface OrderItem {
    // id	主键id	string
    id: string;
    // customerName	客户名称	string
    customerName: string;
    // customerAge	客户年龄	integer(int32)
    customerAge: string;
    // customerSex	客户性别（女:0 男:1)	string
    customerSex: string;
    customerSexCn: string;
    // customerIdNumber	客户身份证	string
    customerIdNumber: string;
    // customerMobile	客户手机号	string
    customerMobile: string;
    // scode	液体活检编号	string
    scode: string;
    // createTime	创建时间	string(date-time)
    createTime: string;
    // createBy	创建者	string
    createBy: string;
    // createByName	创建者名称	string
    createByName: string;
    // errMsg	错误信息(订单生成失败信息)	string
    errMsg: string;
    // marketId	渠道商id(非market表主键)	string
    marketId: string;
    // orderId	订单编号	string
    orderId: string;
    // placeId	地点id	string
    placeId: string;
    // placeName	检测点名称	string
    placeName: string;
    // qcode		string
    qcode: string;
    // registerType	注册类型(字典reg_type)	string
    registerType: string;
    // tenantId	租户id	string
    tenantId: string;
    // updateBy	更新者	string
    updateBy: string;
    // updateTime	更新时间	string(date-time)
    updateTime: string;
    // wechatOpenId
    wechatOpenId: string;
}

/**
 * @description: Request list return value
 */
export type ExportOrderResultModel = ListItem[];
export type OrderListResultModel = BasicFetchResult<OrderItem>;
