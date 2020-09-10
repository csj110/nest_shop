import { Module } from '@nestjs/common';
import { ProdService } from './prod.service';
import { ProdController } from './prod.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product/prdouct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProdService],
  controllers: [ProdController],
})
export class ProdModule {}
