import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CartItemEntity } from 'src/entities/cart.entity';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity) private cartRepo: Repository<CartItemEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>
  ) { }

  async getItems(user: UserEntity) {

    return await this.shopRepo.createQueryBuilder('shop')
      .innerJoinAndMapMany('shop.cart',
        CartItemEntity,
        'item', 'item.shopId = shop.id')
      .getMany()
    // return await this.cartRepo
    //   .createQueryBuilder('i')
    //   .innerJoinAndSelect('i.prod', 'p')
    //   .select('i.number', 'number')
    //   .addSelect(['p.pname', 'p.cover', 'p.price', 'p.inventory'])
    //   .addSelect(["shop.name", 'shop.id'])
    //   .where('i.userId = :userId', { userId: user.id })
    //   .getRawMany();
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
    }
    if (number != 0) {
      cartItem.number = number || cartItem.number + 1;
      cartItem.save();
    } else {
      cartItem.remove();
    }
    return 'ok';
  }

  clearMyCart(user: UserEntity, shopId: number) {
    this.cartRepo.delete({ userId: user.id, shopId });
    return 'ok';
  }
}
