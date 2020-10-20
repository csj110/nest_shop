import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/entities/shop/banner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(@InjectRepository(BannerEntity) private bannerRepo: Repository<BannerEntity>) {}

  async getByType(type: number) {
    return await this.bannerRepo.find({ where: { type } });
  }
}
