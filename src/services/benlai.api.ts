import { a } from 'a';
import axios, { AxiosRequestConfig } from 'axios';
import { json } from 'express';
// import querystring from 'querystring';
const querystring = require('querystring');

const http = axios.create({
  baseURL: 'http://openapitestb.benlai.com',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  return config;
});

http.interceptors.response.use(resp => {
  if (resp.data.code != 0) console.log(resp.config);
  return resp;
});

const clientId = 'B229933192251933';
const clientSecret = '2d4de94a2b9749a596e4599cc2beaca7';

let token: tokenObj = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJjbGllbnQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiQjIyOTkzMzE5MjI1MTkzMyIsIlBhcnRuZXJJZCI6IjE2MiIsImV4cCI6MTYwMTQ1NTkwMCwiaXNzIjoib3BlbiIsImF1ZCI6Im9wZW5hcGkifQ.eLiWtuiW6Cp0C8Sax1_oFen50yGTnjsuSQzHuxBKWZo',
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

const blPost = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
  const res = await http.post(url, data, {
    headers: {
      headers: {
        Authorization: 'Bearer ' + token.token,
      },
    },
  });
  return res.data.value;
};

const blGet = async (url: string, data?: any): Promise<any> => {
  const resp = await http.get(url, {
    params: data,
    headers: {
      Authorization: 'Bearer ' + token.token,
    },
  });
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
  async fetchCate(level: number = 1, parent_id?: string): Promise<BLCate[]> {
    let res;
    if (level == 1 && !parent_id) {
      res = await blGet('api/v2/category/categoryone');
    } else if (level == 2) {
      res = await blGet('api/v2/category/categorytwo', { parent_id });
    } else {
      res = await blGet('api/v2/category/categorythree', { parent_id });
    }
    return res.category_list.map(i => ({
      name: i.category_name,
      pid: i.category_id + '',
      level,
    }));
  },
  fetchProdsByCate(p: CateProdsQuery): Promise<string[]> {
    return blGet('/api/v2/product/ids', p).then(res => {
      return res.product_ids || [];
    });
  },
  fetchProdInfo(p: ProdsQuery): Promise<ProdInfoRes> {
    return blGet('/api/v2/product/item', p).then(res => res.product_list[0]);
  },
  fetchProdImgs(p: ProdQuery): Promise<ProdImgRes[]> {
    return blGet('api/v2/product/images', p).then(res => res.images);
  },
  fetchProdDetail(p: ProdQuery): Promise<string[]> {
    return blGet('api/v2/product/details', p).then(res => {
      let urls = [];
      if (res.img_url.length > 5) urls.push(res.img_url);
      const features = res.features.map(i => i.img_url);
      const buyers = res.buyers.map(i => i.img_url);
      const proposals = res.proposals.map(i => i.img_url);
      const stories = res.stories.map(i => i.img_url);
      const steps = res.steps.map(i => i.img_url);
      urls = [...urls, ...features, ...buyers, ...proposals, ...stories, ...steps];
      return urls;
    });
  },
  fetchProdState(p: ProdsQuery): Promise<ProdStatRes> {
    return blGet('api/v2/product/updownstatus', p).then(res => res.details[0]);
  },
  fetchProdDeliveryArea(p: ProdQuery) {
    return blGet('api/v2/product/deliveryArea', p);
  },
  checkProdSellable(p: ProdSellCheck) {
    return blGet('api/v2/product/checkarea', p);
  },
  fetchProdPrice(p: ProdsQuery) {
    return blGet('api/v2/product/getprice', p);
  },
  fetchProdInventory(p: ProdsQuery) {
    return blGet('api/v2/product/inventory', p);
  },
  async fetchProdAllDetail(p: string): Promise<ProdALLDetailRes> {
    const [
      { product_id: pid, product_name: pname, price, c1_id, c1_name, c2_id, c2_name, c3_id, c3_name },
      swipers,
      detailImgs,
      state,
    ] = await Promise.all([
      benlaiApi.fetchProdInfo({ product_ids: JSON.stringify([p]) }),
      benlaiApi.fetchProdImgs({ product_id: p }),
      benlaiApi.fetchProdDetail({ product_id: p }),
      benlaiApi.fetchProdState({ product_ids: JSON.stringify([p]) }),
    ]);
    return {
      pid,
      pname,
      cover: swipers.length > 0 ? swipers[0].img_url : '',
      price: price * 100,
      deprcated: state.updownstatus == 'UP' ? false : true,
      inventory: 3000,
      detailImgs,
      swipers,
      c1_id: c1_id + '',
      c1_name,
      c2_id: c2_id + '',
      c2_name,
      c3_id: c3_id + '',
      c3_name,
    };
  },
  createOrder(p: OrderPost) {
    return blPost('api/v2/order/create', p);
  },

  /**
   * @param {string} p trade-no 预订单号
   */
  orderConfirm(p: string) {
    return blPost('api/v2/order/confirm', { trade_no: p });
  },
  /**
   * @param p out_trade_no 商户订单号
   */
  orderCancel(out_trade_no: string) {
    return blPost('api/v2/order/cancel', { out_trade_no });
  },
  orderQuery(p: OrderQuery) {
    return blPost('api/v2/order/query', p);
  },
  /**
   * @param p do_id 出库单id
   */
  orderOutStockCheck(p: string) {
    return blPost('api/v2/order/querydo', { do_id: p });
  },
  deliveryCheck(out_trade_no: string) {
    return blPost('api/v2/logistics/get', { out_trade_no });
  },
  fetchFreight(p: Area) {
    return blPost('api/v2/logistics/getfreight', p);
  },
  fetchDeliveryDetail(p: OrderId) {
    return blGet('api/v2/logistics/get', p);
  },
};

interface tokenObj {
  token: string;
  // refreshToken: string;
  createTime: string;
}
interface CateProdsQuery {
  category_id: string | number;
}

interface ProdsQuery {
  product_ids: string;
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

interface BLCate {
  name: string;
  pid: string;
  level: number;
}
//! 返回参数 interface
interface ProdInfoRes {
  product_id: string;
  product_name: string;
  price: number;
  c1_id: number;
  c1_name: string;
  c2_id: number;
  c2_name: string;
  c3_id: number;
  c3_name: string;
}

interface ProdImgRes {
  img_url: string;
  sort: number;
}

interface ProdStatRes {
  updownstatus: string;
}

interface ProdALLDetailRes {
  pid: string;
  pname: string;
  cover: string;
  price: number;
  deprcated: boolean;
  inventory: number;
  detailImgs: string[];
  swipers: ProdImgRes[];
  c1_id: string;
  c1_name: string;
  c2_id: string;
  c2_name: string;
  c3_id: string;
  c3_name: string;
}
