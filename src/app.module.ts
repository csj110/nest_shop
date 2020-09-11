import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { CommonModule } from './domain/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdCateModule } from './domain/prod-cate/prod-cate.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProdModule } from './domain/prod/prod.module';
import { AddrModule } from './domain/addr/addr.module';
import { CateEntity } from './entities/category/cate.product.entity';
import { ShopEntity } from './entities/shop/shop.entity';
import { ProductEntity } from './entities/product/prdouct.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    CommonModule,
    ProdCateModule,
    ProdModule,
    AddrModule,
    TypeOrmModule.forFeature([CateEntity, ShopEntity, ProductEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
