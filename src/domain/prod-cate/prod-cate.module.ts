import { Module } from '@nestjs/common';
import { ProdCateService } from './prod-cate.service';
import { ProdCateController } from './prod-cate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CateEntity } from 'src/entities/category/cate.product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CateEntity])],
  providers: [ProdCateService],
  controllers: [ProdCateController],
})
export class ProdCateModule {}
