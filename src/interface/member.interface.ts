export interface MemberPointInfoQuery {
  memberId: string;
}

export interface CheckoutUniverPoints {
  accountName: string; //用户的账户名称
  accountId: string; //必填 账户编码
  memberId: string; //必填 会员编码
  appKey: string; //必填 系统编号
  payTime: string; //必填 支付时间
  consumIntegral: string; //必填 消费积分
}
export interface CheckoutSpecificPoints {
  accountName: string; //用户的账户名称
  accountId: string; //必填 账户编码
  memberId: string; //必填 会员编码
  appKey: string; //必填 系统编号
  payTime: string; //必填 支付时间
  consumIntegral: string; //必填 消费积分
}

export interface PointsObj {
  accountType: string;
  balance: string;
  designatedMerchantName?: string;
  accountId: string;
  accountName: string;
}
