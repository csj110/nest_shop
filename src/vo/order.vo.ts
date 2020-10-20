export interface LogRes {
  detail: LogDetail[];
  courierName: string;
  courierPhone: string;
  freightCompName: string;
  waybillNo: string;
}

export interface LogDetail {
  desc: string;
  time: string;
}
