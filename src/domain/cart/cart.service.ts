import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ESTALE } from 'constants';
import { CartItemEntity } from 'src/entities/cart.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity) private cartRepo: Repository<CartItemEntity>
  ) {}

  async getItems(shopId: number, user: UserEntity) {
    return await this.cartRepo.find({
      select: ['number'],
      join: {
        alias: 'item',
        leftJoinAndSelect: {
          prod: 'item.prod',
          name: 'prod.pname',
        },
      },
      where: { userId: user.id, shopId },
    });
  }

  async addToCart(prodId: number, user: UserEntity, number?: number): Promise<any> {
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
    } else {
      cartItem.number == number || cartItem.number + 1;
    }
    await cartItem.save();
    return 'ok';
  }

  clearMyCart(user: UserEntity, shopId: number) {
    this.cartRepo.delete({ userId: user.id, shopId });
    return 'ok';
  }
}
