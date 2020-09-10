import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';
import crypto from 'crypto';

const md5 = crypto.createHash('md5');

const http = axios.create({
  baseURL: 'http://sandbox.womaiapp.com/api/rest',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const appkey = '190361';
const appsecret = 'd40lplz85dywwmjxgrv9cnkhjb72fqt6';

const zlPost = async (method: string, param: any = ''): Promise<any> => {
  param = JSON.stringify(param);
  const eSrc = method + appkey + appsecret + param;
  const sign = md5.copy().update(eSrc).digest('hex').toUpperCase();
  const data = querystring.stringify({ method, appkey, param: encodeURIComponent(param), sign });
  const res = await http.post('', data);
  return res.data;
};

const zlApi = {
  fetchPPool() {
    return zlPost('womai.itempagenum.get');
  },
  fetchPList(p: FetchPListParam) {
    return zlPost('womai.itemlist.get', p);
  },
  fetchPDetail(p: SkuId) {
    return zlPost('womai.itemdetail.get', p);
  },
  fetchPState(p: SkuId) {
    return zlPost('womai.itemstatus.get', p);
  },
  fetchPImages(p: SkuId) {
    return zlPost('womai.itemimage.get', p);
  },
  fetchPInventory(p: FetchPInventoryParam) {
    return zlPost('womai.inventory.get', p);
  },
  fetchPPrice(p: SkuIds) {
    return zlPost('womai.price.get', p);
  },
  fetchPCate(p: FetchPCateParam) {
    return zlPost('womai.itemcategory.get', p);
  },
  postPOrder(p: PostPOrderParam) {
    return zlPost('womai.trade.add', p);
  },
  postPOrderConfirm(p: POrderConfirmParam) {
    return zlPost('womai.trade.confirm', p);
  },
  postPOrderCancel(p: POrderCancelParam) {
    return zlPost('womai.trade.cancel', p);
  },
  checkPDelivery(p: PCheckDelivery) {
    return zlPost('womai.area.vaild.get', p);
  },
  fetchPLogistics(p: PId) {
    return zlPost('womai.logistics.get', p);
  },
};

interface FetchPListParam {
  pagenum: string;
}
interface SkuId {
  skuid: string;
}
interface SkuIds {
  skuids: string;
}
interface FetchPInventoryParam {
  skuids: string;
  warehouseid: string;
}
interface FetchPCateParam {
  deptid: string;
}

/**
 * @interface PostPOrderParam
 */
interface PostPOrderParam {
  adjust_fee: number; //* 卖家手工调整金额（默认0）
  buyer_nick: string; //* 买家昵称
  created: string; //!* 交易创建时间 时间格式统一:2019-01-10 03:20:27
  discount_fee: number; //* 订单优惠金额（默认0）
  payment: number; //* 实付金额
  receiver_name: string; // *收货人的姓名
  receiver_state: string; //* 收货人的所在省份
  receiver_city: string; //* 收货人的所在城市
  receiver_district: string; //* 收货人的所在地区
  receiver_address: string; //* 收货人的详细地址
  receiver_mobile: string; //* 收货人手机号码
  post_fee: string; //* 邮费
  tid: string; //* 外部订单号(数字结尾，25个字符以内(只字母和数字))
  total_fee: number; // *商品金额（商品单价乘以数量的总金额）
  point_fee: number; // * 买家使用积分金额
  trade_type: string; //* 统一赋值为：presale
  orders: POrder[];
}
interface POrder {
  tid: string; //* 外部订单号(数字结尾，25个字符以内(只字母和数字))
  num: number; //* 数量
  // iid: string;
  // oid: string;
  outer_iid: string; //* 我买商品编码
  price: number; //* 商品价格
  title: string; //* 商品名称
  total_fee: number; //* 商品金额（单个商品价格乘以数量）
}

interface POrderConfirmParam {
  supplierorderid: string;
}
interface POrderCancelParam {
  supplierorderid: string;
}
interface PCheckDelivery {
  province: string;
  city: string;
  county: string;
  goodstype: string;
}
interface PId {
  tid: string;
}
