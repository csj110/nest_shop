import { Module } from '@nestjs/common';
import { ProdService } from './prod.service';
import { ProdController } from './prod.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { CartItemEntity } from 'src/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CateEntity, CartItemEntity])],
  providers: [ProdService],
  controllers: [ProdController],
})
export class ProdModule {}
