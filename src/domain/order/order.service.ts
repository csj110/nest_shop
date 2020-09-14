import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreateDto } from 'src/dto/order.dto';
import { OrderEntity, OrderState } from 'src/entities/order/order.entity';
import { OrderProductEntity } from 'src/entities/order/order.product.entity';
import { OrderRecordEntity } from 'src/entities/order/order.state.revord';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository, Transaction } from 'typeorm';
import { getShopFreigt } from './freight';
import chance from 'chance';
const moment = require('moment');
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity) private orderProdRepo: Repository<OrderProductEntity>,
    @InjectRepository(OrderRecordEntity) private orderRecordRepo: Repository<OrderRecordEntity>
  ) {}

  @Transaction()
  async createOrder(orderCreateDto: OrderCreateDto, user: UserEntity, shopId: number) {
    const ids = orderCreateDto.prods.map(i => i.prodId);
    const prods = await this.prodRepo.findByIds(ids);
    //todo check the price,inventory,freight.
    let price = 0;
    for (const prod of prods) {
      if (prod.shopId != shopId) throw new BadRequestException('商家数据异常');
    }

    let orderProds = [];

    for (var i = 0; i < orderCreateDto.prods.length; i++) {
      const quantity = orderCreateDto.prods[i].number;
      price += prods[i].price * quantity;
      const newOrderProd = {
        ...prods[i],
        name: prods[i].pname,
        quantity: quantity,
      };
      orderProds.push(newOrderProd);
    }
    price /= 100;
    const { province, city, county, area, receivername, receiverphone } = orderCreateDto;
    const freight = getShopFreigt(shopId, price);
    const newOrder = await this.orderRepo.create({
      province,
      city,
      county,
      area,
      receivername,
      receiverphone,
      price,
      freight,
      oid: moment().format('YYYYMMDDHHmm') + chance.string({ length: 8, casing: 'lower', alpha: true, numeric: true }),
    });
    newOrder.user = user;
    orderProds = await this.orderProdRepo.save(orderProds);
    newOrder.products = orderProds;
    const orderCreateRecord: OrderRecordEntity = await this.orderRecordRepo.save({ message: '订单创建' });
    newOrder.records = [orderCreateRecord];
    await newOrder.save();
    return newOrder.id;
  }

  @Transaction()
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
}
