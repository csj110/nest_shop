import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { BannerEntity } from 'src/entities/shop/banner.entity';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
