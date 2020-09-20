import { BadRequestException, Injectable } from '@nestjs/common';
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


const moment = require('moment');

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity) private orderProdRepo: Repository<OrderProductEntity>,
    @InjectRepository(OrderRecordEntity) private orderRecordRepo: Repository<OrderRecordEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>
  ) { }

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
        myPrice += shopProds[i].price * quantity;
        const newOrderProd = {
          ...shopProds[i],
          name: shopProds[i].pname,
          quantity,
        };
        orderProds.push(newOrderProd);
      }
      const myFreight = getShopFreigt(shopId, price);
      console.log(myPrice, price, freight, myFreight);
      if (myPrice != price || freight != myFreight) throw new BadRequestException('商品价格运费出现变动,请重新下单');
      const createdTime = moment().format('YYYYMMDDHHmmss')
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
          chance.string({ length: 8, casing: 'upper', pool: '0123456789ABCDEF' }),
        shopId: tShop.id,
      });
      newOrder.user = user;
      try {
        //todo 向商户发出订单请求,修改订单状态,然后扣除积分,积分扣除失败的话需要,撤销向商户

        // * 先使用BL测试
        //todo 根据商城不同 确定不同api 
        const res = await this.createZLOrder(orderProds, newOrder, createdTime)
        console.log(res);
        // orderProds = await this.orderProdRepo.save(orderProds);
        // newOrder.products = orderProds;
        // const orderCreateRecord: OrderRecordEntity = await this.orderRecordRepo.save({ message: '用户创建订单' });
        // newOrder.records = [orderCreateRecord];
        // await newOrder.save();
      } catch (error) {
        //todo 失败的话,订单状态不改变
        console.log(error);
      }
    }
  }

  async checkoutOrders(orderId: number, user: UserEntity) {
    const order = await this.orderRepo.findOne(orderId, { relations: ['user'] });
    if (order.user.id != user.id) throw new BadRequestException('非本人订单');
    //todo 发送到商户 并且扣除会员分数
    const orderRecord = await this.orderRecordRepo.create({ message: '支付' });
    orderRecord.order = order;
    order.state = OrderState.PAYED;
    await orderRecord.save();
    await order.save();
  }


  async createZLOrder(orderProds: MyOrderProdOrigin[], order: OrderEntity, time: string) {
    const orders: POrder[] = orderProds.map((i, index) => ({
      tid: order.oid,
      oid:order.oid+index,
      num: i.quantity,
      outer_iid: i.pid,
      price: i.price / 100,
      title: i.pname,
      total_fee: i.price * i.quantity / 100
    }))

    const orderRequest: PostPOrderParam = {
      tid: order.oid,
      created: moment(time).format("YYYY-MM-DD HH:mm:ss"),
      adjust_fee: 0,
      buyer_nick: order.receivername,
      payment: order.price / 100,
      discount_fee: 0,
      total_fee: order.freight + order.price,
      post_fee: order.freight,
      receiver_name: order.receivername,
      receiver_state: order.province,
      receiver_city: order.city,
      receiver_district: order.county,
      receiver_address: order.area,
      receiver_mobile: order.receiverphone,
      orders
    }
    console.log(orderRequest);
    return await zlApi.postPOrder(orderRequest)
  }
}


