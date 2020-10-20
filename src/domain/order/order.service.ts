import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreateDto } from 'src/dto/order.dto';
import { OrderEntity, OrderState } from 'src/entities/order/order.entity';
import { OrderProductEntity } from 'src/entities/order/order.product.entity';
import { OrderRecordEntity } from 'src/entities/order/order.record.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { UserEntity } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';

var Chance = require('chance');
var chance = new Chance();
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { MyOrderProdOrigin } from 'src/interface/interface';
import { POrder, PostPOrderParam } from 'src/services/zl.api';

import { zlApi } from '../../services/zl.api';
import apiMap, { CreateOrderRes } from './order.api';
import { MemberService } from '../common/member.service';
import { PointsObj } from 'src/interface/member.interface';

const moment = require('moment');

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity) private orderProdRepo: Repository<OrderProductEntity>,
    @InjectRepository(OrderRecordEntity) private orderRecordRepo: Repository<OrderRecordEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>,
    private memberService: MemberService
  ) {}

  async getOrders(page: number, perPage: number, state: string[], user: UserEntity) {
    return await this.orderRepo.find({
      // select: [
      //   'province',
      //   'city',
      //   'county',
      //   'area',
      //   'receivername',
      //   'receiverphone',
      //   'state',
      //   'oid',
      //   'price',
      //   'freight',
      //   'products',
      // ],
      relations: ['products'],
      where: state ? { user, state: In(state) } : { user },
      take: perPage,
      order: { id: 'DESC' },
      skip: (page - 1) * perPage,
    });
  }

  async getOrder(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { where: { user }, relations: ['products'] });
    return order.toJson();
  }

  async createOrder(orderCreateDto: OrderCreateDto, user: UserEntity) {
    const { province, city, county, area, receivername, receiverphone, payMethod } = orderCreateDto;
    for (const shopOrder of orderCreateDto.shops) {
      const { shopId, freight, prods, tPrice, fPrice, discount } = shopOrder;
      const shopprods = prods.split(';').map(i => {
        let [prodIdStr, numberStr] = i.split(':');
        return { prodId: parseInt(prodIdStr), number: parseInt(numberStr) };
      });
      const ids = shopprods.map(i => i.prodId);
      const shopProds = await this.prodRepo.findByIds(ids, { where: { shopId: shopId } });
      const shop = await this.shopRepo.findOne(shopId, { cache: 1000 * 60 }); // * 目标商店
      if (shopProds.length != ids.length) throw new BadRequestException('商品数据异常');
      let myPrice = 0;
      let orderProds = [];
      for (var i = 0; i < shopprods.length; i++) {
        const quantity = shopprods[i].number;
        if (shopProds[i].inventory >= quantity) {
          shopProds[i].inventory -= quantity;
          myPrice += shopProds[i].price * quantity;
          const newOrderProd = {
            ...shopProds[i],
            name: shopProds[i].pname,
            quantity,
          };
          orderProds.push(newOrderProd);
        } else {
          throw new BadRequestException('库存不足');
        }
      }
      const [myFreight, myDiscount] = this.getShopFreigtAndDiscount(shop, tPrice);
      console.log(tPrice, myPrice, freight, myFreight, discount, myDiscount);
      if (myPrice != tPrice || freight != myFreight || myDiscount != discount)
        throw new BadRequestException('商品价格运费出现变动,请重新下单');
      const createdTime = moment().format('YYYYMMDDHHmmss');
      console.log(createdTime);
      const newOrder: OrderEntity = await this.orderRepo.create({
        province,
        city,
        county,
        area,
        receivername,
        receiverphone,
        discount,
        freight,
        tPrice,
        payMethod,
        fPrice,
        oid:
          shop.code +
          createdTime +
          chance.string({ length: 5, casing: 'upper', pool: '0123456789ABCDEF' }) +
          chance.string({ length: 1, pool: '0123456789' }),
        shopId: shop.id,
      });
      newOrder.user = user;
      let count = 0;
      let message = '';
      try {
        //todo 向商户发出订单请求,修改订单状态,然后扣除积分,积分扣除失败的话需要,撤销向商户
        // * 先使用BL测试
        //todo 根据商城不同 确定不同api  商品数量减少
        console.log('开始生成订单');
        const res: CreateOrderRes = await apiMap[shop.code].create({
          ...newOrder,
          prods: orderProds,
          ctime: createdTime,
        });
        console.log(res);
        newOrder.tradeId = res.tradeId;
        orderProds = await this.orderProdRepo.save(orderProds);
        newOrder.products = orderProds;
        const orderCreateRecord: OrderRecordEntity = await this.orderRecordRepo.save({ message: '用户创建订单' });
        newOrder.records = [orderCreateRecord];
        await newOrder.save();
        //* 更新产品的库存信息
        await this.prodRepo.save(shopProds);
      } catch (error) {
        //todo 失败的话,订单状态不改变
        count++;
        console.log(error);
        message += error;
      }
      return { total: orderCreateDto.shops.length, fail: count, message };
    }
  }

  async checkoutOrders(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { relations: ['user'] });
    if (order.state != OrderState.CREATED) throw new NotAcceptableException('目前订单无法支付');
    if (order.user.id != user.id) throw new BadRequestException('非本人订单');
    const shop = await this.shopRepo.findOne(order.shopId);
    //* 扣除会员积分
    //todo paydate
    // if (order.payMethod == 'universe') {
    //   await this.checkoutUniverseOrder(order, user, shop);
    // } else {
    //   await this.checkoutSpecificOrder(order, user, shop);
    // }
    //* 发送到商户 并且扣除会员分数
    let message = '支付';
    let orderState = OrderState.PAYED;
    try {
      const res = await apiMap[shop.code].confirm(order);
      console.log(res);
    } catch (error) {
      console.log(error);
      console.log('项商户推送订单失败');
      message = '积分已扣除订单生成失败:' + error;
      orderState = OrderState.DECREASE_WRONG;
    }
    const orderRecord = await this.orderRecordRepo.create({ message });
    orderRecord.order = order;
    order.state = orderState;
    await orderRecord.save();
    await order.save();
    if (orderState == OrderState.DECREASE_WRONG) throw new InternalServerErrorException(message);
  }

  async getState(orderId: number, user: UserEntity) {
    const order = await this.checkOrderOwnship(orderId, user);
    return await zlApi.fetchOrderState({ supplierorderid: order.oid });
  }

  private async checkOrderOwnship(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { where: { user: user } });
    if (!order) throw new BadRequestException('您不存在该订单');
    return order;
  }

  async getLog(orderId: number, user: UserEntity) {
    const order = await this.checkOrderOwnship(orderId, user);
    const shopCode = order.oid.slice(0, 2);
    return await apiMap[shopCode].log(order);
  }

  async cancelOrder(orderId: number, user: UserEntity) {
    const order = await this.checkOrderOwnship(orderId, user);
    if (order.state != OrderState.CREATED) throw new BadRequestException('无法取消订单');
    //todo  取消订单
    await zlApi.postPOrderCancel({ supplierorderid: order.oid });
    order.state = OrderState.CANCELED;
    await this.orderRecordRepo.save({ message: '用户取消订单', order });
    await order.save();
  }

  //* 辅助函数,计算运费和满减
  private getShopFreigtAndDiscount(shop: ShopEntity, tPrice: number): number[] {
    let myFreight,
      myDiscount = 0;
    //* 计算满减
    const { discountStr } = shop;
    console.log(discountStr);
    const mapArr = discountStr.split(';').map(i => {
      const arr = i.split(':');
      return [parseInt(arr[0]), parseInt(arr[1])];
    });
    for (var i = mapArr.length - 1; i > -1; i--) {
      if (tPrice > mapArr[i][0] * 100) {
        myDiscount = mapArr[i][1] * 100;
        break;
      }
    }
    //* 计算运费
    const { freight, nfPrice } = shop;
    myFreight = tPrice > nfPrice ? 0 : freight;
    return [myFreight, myDiscount];
  }

  private async checkoutUniverseOrder(order: OrderEntity, user: UserEntity, shop: ShopEntity) {
    const pointsObj: PointsObj = await this.memberService.getUniversePoints({ memberId: user.memberId });
    if (order.fPrice > parseInt(pointsObj.balance)) throw new BadRequestException('积分不足');

    await this.memberService.checkoutUniversePoints({
      memberId: user.memberId,
      payTime: moment(order.payTime).format('YYYY-MM-DD HH:mm:ss:SSS'),
      accountName: pointsObj.accountName,
      appKey: shop.creditCode,
      consumIntegral: order.fPrice.toString(10),
      accountId: pointsObj.accountId,
    });
  }

  private async checkoutSpecificOrder(order: OrderEntity, user: UserEntity, shop: ShopEntity) {
    const pointsObj: PointsObj = await this.memberService.getShopSpecificPoints(
      { memberId: user.memberId },
      shop.cname
    );

    if (order.fPrice > parseInt(pointsObj.balance)) {
      throw new BadRequestException('积分不足');
    }

    await this.memberService.checkoutSpecificPoints({
      memberId: user.memberId,
      payTime: moment(order.payTime).format('YYYY-MM-DD HH:mm:ss:SSS'),
      accountName: pointsObj.accountName,
      appKey: shop.creditCode,
      consumIntegral: order.fPrice.toString(10),
      accountId: pointsObj.accountId,
    });
  }
}
