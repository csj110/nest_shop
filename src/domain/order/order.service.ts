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
      const newOrder = await this.orderRepo.create({
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
          moment().format('YYYYMMDDHHmmss') +
          chance.string({ length: 8, casing: 'upper', pool: '0123456789ABCDEF' }),
        shopId: tShop.id,
      });
      newOrder.user = user;
      orderProds = await this.orderProdRepo.save(orderProds);
      newOrder.products = orderProds;
      const orderCreateRecord: OrderRecordEntity = await this.orderRecordRepo.save({ message: '用户创建订单' });
      newOrder.records = [orderCreateRecord];
      await newOrder.save();
      try {
        //todo 向商户发出订单请求,修改订单状态,然后扣除积分,积分扣除失败的话需要,撤销向商户
      } catch (error) {
        //todo 失败的话,订单状态不改变
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
}
