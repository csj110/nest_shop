import { OrderEntity } from 'src/entities/order/order.entity';
import { MyOrderProdOrigin } from 'src/interface/interface';
import { benlaiApi } from '../../services/benlai.api';
import { zlApi } from '../../services/zl.api';

const ZLOrderApi = {
  create(p: CreateOrderDto) {
    return zlApi.postPOrder(p);
  },
};
const BLOorderApi = {
  create(p: CreateOrderDto): Promise<CreateOrderRes> {
    return benlaiApi.createOrder(p);
  },
  confirm({ tradeId }: ConfirmOrderDto) {
    return benlaiApi.orderConfirm(tradeId);
  },
  log({ oid }: OrderEntity) {
    return benlaiApi.fetchDeliveryDetail({ out_trade_no: oid });
  },
};

const apiMap = {
  BL: BLOorderApi,
  ZL: ZLOrderApi,
};

export default apiMap;

export interface CreateOrderDto {
  province: string;
  city: string;
  county: string;
  area: string;
  receivername: string;
  receiverphone: string;
  message: string;
  oid: string;
  prods: MyOrderProdOrigin[];
  tPrice: number;
  fPrice: number;
  freight: number;
  ctime: string;
}
export interface ConfirmOrderDto {
  oid: string;
  tradeId: string;
}

export interface CreateOrderRes {
  tradeId?: string;
}
