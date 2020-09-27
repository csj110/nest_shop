import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreateDto } from 'src/dto/order.dto';
import { OrderEntity, OrderState } from 'src/entities/order/order.entity';
import { OrderProductEntity } from 'src/entities/order/order.product.entity';
import { OrderRecordEntity } from 'src/entities/order/order.record.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { getShopFreigt } from './freight';

var Chance = require('chance');
var chance = new Chance();
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { MyOrderProdOrigin } from 'src/interface/interface';
import { POrder, PostPOrderParam } from 'src/services/zl.api';

import { zlApi } from '../../services/zl.api';
import { retryWhen } from 'rxjs/operators';

const moment = require('moment');

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity) private orderProdRepo: Repository<OrderProductEntity>,
    @InjectRepository(OrderRecordEntity) private orderRecordRepo: Repository<OrderRecordEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>
  ) {}

  async getOrders(page: number, perPage: number, state: number, user: UserEntity) {
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
      where: state ? { user, state } : { user },
      take: perPage,
      skip: (page - 1) * perPage,
    });
  }

  async getOrder(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { where: { user }, relations: ['products'] });
    return order.toJson();
  }

  async createOrder(orderCreateDto: OrderCreateDto, user: UserEntity) {
    const { province, city, county, area, receivername, receiverphone } = orderCreateDto;
    for (const shop of orderCreateDto.shops) {
      const { shopId, freight, prods, price } = shop;
      const shopprods = prods.split(';').map(i => {
        let [prodIdStr, numberStr] = i.split(':');
        return { prodId: parseInt(prodIdStr), number: parseInt(numberStr) };
      });
      const ids = shopprods.map(i => i.prodId);
      const shopProds = await this.prodRepo.findByIds(ids, { where: { shopId: shopId } });
      const tShop = await this.shopRepo.findOne(shopId, { cache: 1000 * 60 }); // * 目标商店
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
      const myFreight = getShopFreigt(shopId, price);
      console.log(myPrice, price, freight, myFreight);
      if (myPrice != price || freight != myFreight) throw new BadRequestException('商品价格运费出现变动,请重新下单');
      const createdTime = moment().format('YYYYMMDDHHmmss');
      console.log(createdTime);
      const newOrder: OrderEntity = await this.orderRepo.create({
        province,
        city,
        county,
        area,
        receivername,
        receiverphone,
        price,
        freight,
        oid:
          tShop.code +
          createdTime +
          chance.string({ length: 5, casing: 'upper', pool: '0123456789ABCDEF' }) +
          chance.string({ length: 1, pool: '0123456789' }),
        shopId: tShop.id,
      });
      newOrder.user = user;
      try {
        //todo 向商户发出订单请求,修改订单状态,然后扣除积分,积分扣除失败的话需要,撤销向商户
        // * 先使用BL测试
        //todo 根据商城不同 确定不同api
        await this.createZLOrder(orderProds, newOrder, createdTime);
        orderProds = await this.orderProdRepo.save(orderProds);
        newOrder.products = orderProds;
        const orderCreateRecord: OrderRecordEntity = await this.orderRecordRepo.save({ message: '用户创建订单' });
        newOrder.records = [orderCreateRecord];
        await newOrder.save();
        await this.prodRepo.save(shopProds);
      } catch (error) {
        //todo 失败的话,订单状态不改变
        console.log(error);
      }
    }
  }

  async checkoutOrders(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { relations: ['user'] });
    if (order.state != OrderState.CREATED) throw new NotAcceptableException('目前订单无法支付');
    if (order.user.id != user.id) throw new BadRequestException('非本人订单');

    //todo 扣除会员积分
    //* 发送到商户 并且扣除会员分数
    const res = await zlApi.postPOrderConfirm({ supplierorderid: order.oid });
    console.log(res);
    const orderRecord = await this.orderRecordRepo.create({ message: '支付' });
    orderRecord.order = order;
    order.state = OrderState.PAYED;
    await orderRecord.save();
    await order.save();
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
    return await zlApi.fetchPLogistics({ tid: order.oid });
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

  private async createZLOrder(orderProds: MyOrderProdOrigin[], order: OrderEntity, time: string) {
    const orders: POrder[] = orderProds.map((i, index) => ({
      tid: order.oid,
      oid: order.oid + index,
      num: i.quantity,
      outer_iid: i.pid,
      price: i.price / 100,
      title: i.pname,
      total_fee: (i.price * i.quantity) / 100,
    }));

    time = time.slice(0, 8) + 'T' + time.slice(8);

    const orderRequest: PostPOrderParam = {
      tid: order.oid,
      created: moment(time).format('YYYY-MM-DD HH:mm:ss'),
      adjust_fee: 0,
      trade_type: 'presale',
      buyer_nick: order.receivername,
      payment: order.price / 100,
      discount_fee: 0 / 100,
      total_fee: (order.freight + order.price) / 100,
      post_fee: order.freight / 100,
      receiver_name: order.receivername,
      receiver_state: order.province,
      receiver_city: order.city,
      receiver_district: order.county,
      receiver_address: order.city + order.county + order.area,
      receiver_mobile: order.receiverphone,
      orders: { order: orders },
    };
    await zlApi.postPOrder(orderRequest);
  }
}
