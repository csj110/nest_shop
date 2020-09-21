import { Controller, Get } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopRepo: ShopService) {}

  @Get('')
  async getShops() {
    return await this.shopRepo.getAllShops();
  }
}
