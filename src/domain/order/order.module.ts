import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, } from 'src/entities/order/order.entity';
import { OrderProductEntity } from 'src/entities/order/order.product.entity';
import { OrderRecordEntity } from 'src/entities/order/order.record.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity,OrderRecordEntity,OrderProductEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
