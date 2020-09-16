import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';

const http = axios.create({
  baseURL: 'http://openapitestb.benlai.com',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const clientId = 'B229933192251933';
const clientSecret = '2d4de94a2b9749a596e4599cc2beaca7';

let token: tokenObj = {
  token: '',
  refreshToken: '',
  createTime: '',
};

// async function fetchToken() {
//   const { access_token, refresh_token } = await benlaiApi.fetchToken({ clientId, clientSecret });
//   token = { token: access_token, refreshToken: refresh_token, createTime: moment().toString() };
//   return access_token;
// }

// async function getToken() {
//   if (token.token != '' && moment(token.token).add(20, 'h').isAfter()) {
//     return token.token;
//   }
//   return await fetchToken();
// }

const sfPost = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
  const res = await http.post(url, querystring.stringify(data), config);
  return res.data;
};

const sfGet = async (url: string, data?: any): Promise<any> => {
  const resp = await http.get(url, { data: querystring.stringify(data) });
  return resp.data.value;
};

export const benlaiApi = {
  async fetchToken() {
    const token = Buffer.from(clientId + ':' + clientSecret).toString('base64');
    const res = await http.post(
      'token',
      { grant_type: 'client_credentials', scope: 'yghwechat' },
      {
        headers: { Authorization: 'Basic ' + token },
      }
    );
    return res.data.value;
  },
  async fetchCate(level: number = 0, parent_id?: string) {
    if (level == 0 && !parent_id) return sfGet('api/v2/category/categoryone');
    if (level == 1) return sfGet('api/v2/category/categorytwo', { parent_id });
    return sfGet('api/v2/category/categorythree', { parent_id });
  },
  fetchProdsByCate(p: CateProdsQuery) {
    return sfGet('/api/v2/product/ids');
  },
  fetchProdInfo(p: ProdsQuery) {
    return sfGet('/api/v2/product/item', p);
  },
  fetchProdImgs(p: ProdQuery) {
    return sfGet('api/v2/product/images', p);
  },
  fetchProdDetail(p: ProdQuery) {
    return sfGet('api/v2/product/details', p);
  },
  fetchProdState(p: ProdsQuery) {
    return sfGet('api/v2/product/updownstatus', p);
  },
  fetchProdDeliveryArea(p: ProdQuery) {
    return sfGet('api/v2/product/deliveryArea', p);
  },
  checkProdSellable(p: ProdSellCheck) {
    return sfGet('api/v2/product/checkarea', p);
  },
  fetchProdPrice(p: ProdsQuery) {
    return sfGet('api/v2/product/getprice', p);
  },
  fetchProdInventory(p: ProdsQuery) {
    return sfGet('api/v2/product/inventory', p);
  },
  createOrder(p: OrderPost) {
    return sfPost('api/v2/order/create', p);
  },
  /**
   * @param {string} p trade-no 预订单号
   */
  orderConfirm(p: string) {
    return sfPost('api/v2/order/confirm', { trade_no: p });
  },
  /**
   * @param p out_trade_no 商户订单号
   */
  orderCancel(out_trade_no: string) {
    return sfPost('api/v2/order/cancel', { out_trade_no });
  },
  orderQuery(p: OrderQuery) {
    return sfPost('api/v2/order/query', p);
  },
  /**
   * @param p do_id 出库单id
   */
  orderOutStockCheck(p: string) {
    return sfPost('api/v2/order/querydo', { do_id: p });
  },
  deliveryCheck(out_trade_no: string) {
    return sfPost('api/v2/logistics/get', { out_trade_no });
  },
  fetchFreight(p: Area) {
    return sfPost('api/v2/logistics/getfreight', p);
  },
  fetchDeliveryDetail(p: OrderId) {
    return sfGet('api/v2/logistics/get', p);
  },
};

interface tokenObj {
  token: string;
  refreshToken: string;
  createTime: string;
}
interface CateProdsQuery {
  category_id: number;
}

interface ProdsQuery {
  product_ids: string[];
}

interface ProdQuery {
  product_id: string;
}

interface ProdSellCheck {
  product_ids: string[];
  province: string;
  city: string;
  county: string;
}

interface OrderPost {
  out_trade_no: string; // * 订单编号
  receive_contact: string; //* 收货人姓名
  receive_phone: string; //* 收货人姓名
  province: string;
  city: string;
  county: string;
  receive_address: string; //* 收货人地址
  order_price: number; //* 订单价格 ,不包含运费
  ship_price: number; //* 订单运费
  order_detail: OrderProd[];
}

interface OrderProd {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderQuery {
  out_trade_no?: string; // * 商户订单号
  order_id?: string; //* 接单方的订单号
}
interface OrderId {
  out_trade_no: string; // * 商户订单号
}
interface Area {
  province: string;
  city: string;
  county: string;
}
