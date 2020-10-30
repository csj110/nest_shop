import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance, } from 'axios';
import { CheckoutUniverPoints, MemberPointInfoQuery, PointsObj } from 'src/interface/member.interface';

const moment = require('moment');
const crypto = require('crypto');

function genHeader() {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss:SSS');
  const appKey = process.env.appKey;
  const signature = crypto
    .createHmac('sha1', process.env.appSecret)
    .update(timestamp + appKey)
    .digest()
    .toString('base64');
  return { appKey, timestamp, signature };
}

@Injectable()
export class MemberService {
  private host: string;
  private http: AxiosInstance;

  constructor() {
    this.host = process.env.MemberServiceHost;
    this.http = axios.create({
      baseURL: this.host,
    });

    this.http.interceptors.request.use(config => {
      config.headers = { ...config.headers, ...genHeader() };
      return config;
    });
  }

  private getURL(path: string): string {
    return this.host + path;
  }

  async findMember(query: MemberPointInfoQuery): Promise<any> {
    const res = await this.getUserPointsArray(query);
    return this.getFindMemberData(res);
  }
  // todo * 积分扣减 PH:普惠?
  async checkoutUniversePoints(checkoutInfo: CheckoutUniverPoints) {
    const { data } = await this.http.post(this.getURL('payMemberAcountV2'), checkoutInfo).catch(err => {
      console.log(err);
      throw new BadRequestException('会员系统出错' + 'statusCode: ' + err.response.status);
    });
    if (data.code != 200) throw new BadRequestException(data.message);
  }

  // * 数据清理,对应函数名 findMember
  private getFindMemberData(pointsArray: any[]) {
    //todo 需要确认积分类型 普惠 扶贫, 通用 专用
    const res = {
      universe: {
        points: 0,
        accountId: '',
      },
      specific: [],
    };
    for (let i = 0; i < pointsArray.length; i++) {
      const { accountType, balance, designatedMerchantName, accountId } = pointsArray[i];
      //* 通用积分
      if (accountType == '01') {
        res.universe.points = parseInt(balance);
        res.universe.accountId = accountId;
      }
      //* 专用积分
      if (accountType == '02') {
        res.specific.push({ shopName: designatedMerchantName, points: parseInt(balance), accountId });
      }
    }
    return res;
  }

  private async getUserPointsArray(query: MemberPointInfoQuery): Promise<PointsObj[]> {
    const { data } = await this.http
      .post(this.getURL('selectMemberAcount'), query, { headers: genHeader() })
      .catch(err => {
        throw new BadRequestException('会员系统出错' + 'statusCode: ' + err.response.status);
      });
    if (data.code != 200 || !data.data || !data.data.length)
      throw new InternalServerErrorException('union info query failed');
    return data.data;
  }

  async getUniversePoints(query: MemberPointInfoQuery) {
    const res = await this.getUserPointsArray(query);
    return this.getUniverseData(res);
  }

  async getShopSpecificPoints(qu: MemberPointInfoQuery, shopName: string) {
    const res = await this.getUserPointsArray(qu);
    return this.getSpecificData(res, shopName);
  }

  private getUniverseData(pointsArray: PointsObj[]): PointsObj {
    const [a] = pointsArray.filter(i => i.accountType == '01');
    if (!a) throw new BadRequestException('无通用积分');
    return a;
  }

  private getSpecificData(pointsArray: PointsObj[], shopName: string): PointsObj {
    const [a] = pointsArray.filter(i => i.designatedMerchantName == shopName);
    if (!a) throw new BadRequestException('无通用积分');
    return a;
  }

  async checkoutSpecificPoints(checkoutInfo: CheckoutUniverPoints) {
    const { data } = await this.http.post(this.getURL('paySpecialMemberAcount'), checkoutInfo).catch(err => {
      console.log(err);
      throw new BadRequestException('会员系统出错' + 'statusCode: ' + err.response.status);
    });
    if (data.code != 200) throw new BadRequestException(data.message);
  }
}
