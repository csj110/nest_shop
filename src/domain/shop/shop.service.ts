import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from 'src/entities/shop/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(@InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>) {}

  async getAllShops() {
    return await this.shopRepo.find({ order: { level: 1, sort: 1 } });
  }
}
