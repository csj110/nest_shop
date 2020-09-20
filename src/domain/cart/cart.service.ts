import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { raw } from 'express';
import { retry } from 'rxjs/operators';

import { CartItemEntity } from 'src/entities/cart.entity';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ShopCartVo } from 'src/vo/cart.vo';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity) private cartRepo: Repository<CartItemEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>
  ) { }

  async getItems(user: UserEntity) {
    const rawList = await this.cartRepo
      .createQueryBuilder('i')
      .innerJoin(ShopEntity, 'shop', 'shop.id = i.shopId')
      .innerJoin(ProductEntity, 'p', 'p.id = i.prodId')
      .select(['shop.name', 'shop.id'])
      .addSelect(['p.cover', 'p.price', 'p.inventory', 'p.pname'])
      .addSelect(['i.number'])
      .where('i.userId = :userId', { userId: user.id })
      .getRawMany();
    return this.mapRawCartitemsToShopCart(rawList);
  }

  async addToCart(prodId: number, user: UserEntity, number?: number): Promise<any> {
    console.log(number);
    const prod = await this.prodRepo.findOne(prodId);
    if (!prod) throw new BadRequestException('no such a prod');
    let cartItem = await this.cartRepo.findOne({ where: { userId: user.id, shopId: prod.shopId, prodId: prodId } });
    if (!cartItem) {
      cartItem = await this.cartRepo.create({
        prodId: prodId,
        shopId: prod.shopId,
        userId: user.id,
        number: number || 1,
      });
      await cartItem.save();
    } else {
      console.log(cartItem);
      if (number != 0) {
        cartItem.number = number || cartItem.number + 1;
        await cartItem.save();
      } else {
        await cartItem.remove();
      }
    }
    return 'ok';
  }

  clearMyCart(user: UserEntity, shopId: number) {
    this.cartRepo.delete({ userId: user.id, shopId });
    return 'ok';
  }

  mapRawCartitemsToShopCart(src: any[]): ShopCartVo[] {
    const shopMap = {}
    const res = []
    src.forEach(i => {
      let shop = shopMap[i.shop_name]
      if (shop == undefined) {
        shop = {}
        shop.cart = []
        shop.name = i.shop_name
        shop.id = i.shop_id
      }
      shop.cart.push({ pname: i.p_pname, cover: i.P_cover, price: i.p_price, inventory: i.p_inventory, number: i.i_number })
      shopMap[i.shop_name] = shop
    })

    for (const key in shopMap) {
      res.push(shopMap[key])
    }
    return res
  }
}
