import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from 'src/entities/cart.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { ShopEntity } from 'src/entities/shop/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CartItemEntity, ShopEntity])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule { }
