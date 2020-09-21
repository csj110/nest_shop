import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopEntity])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
