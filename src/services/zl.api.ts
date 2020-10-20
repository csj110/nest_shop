import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { CreateOrderDto } from 'src/domain/order/order.api';
const moment = require('moment');

const querystring = require('querystring');
const crypto = require('crypto');

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
  const data = querystring.stringify({ method, appkey, param, sign });
  const res = await http.post('', data);
  if (res.data.error_response) return Promise.reject(res.data.error_response);
  return res.data;
};

export const zlApi = {
  fetchPPool() {
    return zlPost('womai.itempagenum.get', {}).then(res => res.itempagenum);
  },
  fetchPList(p: FetchPListParam) {
    return zlPost('womai.itemlist.get', p).then(res => res.itemlist);
  },
  fetchPDetail(p: SkuId) {
    return zlPost('womai.itemdetail.get', p)
      .then(res => res.itemdetail[0])
      .then(({ goodsid, goodsname, prodescription, category }) => {
        const r = /(?<=src=[\'\"])(\S*)(?=[\'\"])/g;
        const detailImages = prodescription.match(r) || [];
        return { pid: goodsid, pname: goodsname, detailImages, category };
      });
  },
  fetchPState(p: SkuId) {
    return zlPost('womai.itemstatus.get', p).then(res => {
      const state = res.itemstatus[0].status == '1' ? true : false;
      return state;
    });
  },
  fetchPImages(p: SkuId) {
    return zlPost('womai.itemimage.get', p).then(res => {
      return res.itemimage[0].image;
    });
  },
  fetchPInventory(p: FetchPInventoryParam): Promise<number> {
    return zlPost('womai.inventory.get', p).then(res => {
      console.log(res);
      return parseInt(res.Inventory[0].inventory);
    });
  },
  fetchPPrice(p: SkuIds): Promise<number> {
    return zlPost('womai.price.get', p).then(res => res.price[0].price);
  },
  fetchPCate(p: FetchPCateParam) {
    return zlPost('womai.itemcategory.get', p).then(res => {
      return res.itemcategory;
    });
  },
  postPOrder(p: CreateOrderDto) {
    let { prods, oid, ctime, receivername, receiverphone, province, city, county, area, fPrice, freight } = p;
    const orders = prods.map((i, index) => ({
      tid: oid,
      oid: oid + index,
      num: i.quantity,
      outer_iid: i.pid,
      price: i.price / 100,
      title: i.pname,
      total_fee: (i.price * i.quantity) / 100,
    }));
    ctime = ctime.slice(0, 8) + 'T' + ctime.slice(8);
    const trade: PostPOrderParam = {
      tid: oid,
      created: moment(ctime).format('YYYY-MM-DD HH:mm:ss'),
      adjust_fee: 0,
      trade_type: 'presale',
      buyer_nick: receivername,
      payment: fPrice / 100,
      discount_fee: 0 / 100,
      total_fee: (freight + fPrice) / 100,
      post_fee: freight / 100,
      receiver_name: receivername,
      receiver_state: province,
      receiver_city: city,
      receiver_district: county,
      receiver_address: city + county + area,
      receiver_mobile: receiverphone,
      orders: { order: orders },
    };
    const param = {
      trade: { trade_add_request: { trade } },
    };
    return zlPost('womai.trade.add', param).then(res => {
      if (res.result != 'true') throw new InternalServerErrorException('商家返回数据异常');
      return res;
    });
  },
  postPOrderConfirm(p: POrderConfirmParam) {
    console.log(p);
    return zlPost('womai.trade.confirm', p).then(res => {
      if (res.result != 'true') throw new InternalServerErrorException('商户订单确认失败');
      return res;
    });
  },
  postPOrderCancel(p: POrderCancelParam) {
    return zlPost('womai.trade.cancel', p);
  },
  fetchOrderState(p: POrderState) {
    return zlPost('womai.trade.get', p);
  },
  checkPDelivery(p: PCheckDelivery) {
    //* 配送范围
    return zlPost('womai.area.vaild.get', p);
  },
  fetchPLogistics(p: PId) {
    return zlPost('womai.logistics.get', p).catch(err => {
      if (!err.code) return [];
      throw new InternalServerErrorException('查询出错');
    });
  },
};

export interface FetchPListParam {
  pagenum: string;
}
export interface SkuId {
  skuid: string;
}
export interface SkuIds {
  skuids: string;
}
export interface FetchPInventoryParam {
  skuids: string;
  warehouseid: string;
}
export interface FetchPCateParam {
  deptid: string;
}

/**
 * @export  interface PostPOrderParam
 */
export interface PostPOrderParam {
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
  post_fee: number; //* 邮费
  tid: string; //* 外部订单号(数字结尾，25个字符以内(只字母和数字))
  total_fee: number; // *商品金额（商品单价乘以数量的总金额）
  // point_fee: number; // * 买家使用积分金额
  trade_type: string; //* 统一赋值为：presale
  orders: { order: POrder[] };
}
export interface POrder {
  tid: string; //* 外部订单号(数字结尾，25个字符以内(只字母和数字))
  num: number; //* 数量
  // iid: string;
  oid: string;
  outer_iid: string; //* 我买商品编码
  price: number; //* 商品价格
  title: string; //* 商品名称
  total_fee: number; //* 商品金额（单个商品价格乘以数量）
}

export interface POrderConfirmParam {
  supplierorderid: string;
}
export interface POrderCancelParam {
  supplierorderid: string;
}
export interface PCheckDelivery {
  province: string;
  city: string;
  county: string;
  goodstype: string;
}
export interface PId {
  tid: string;
}

export interface POrderState {
  supplierorderid: string;
}
