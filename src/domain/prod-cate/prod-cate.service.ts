import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { TreeRepository } from 'typeorm';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class ProdCateService {
  constructor(@InjectRepository(CateEntity) private cateRepo: TreeRepository<CateEntity>) {}

  async findCateList(shop: string) {}

  async createCate(shop: string, parent: CateEntity) {}

  async createRootCate(shop: string) {
    const res = await this.cateRepo.findTrees();
    console.log(JSON.stringify(res));
  }

  async createNewCate(data): Promise<CateEntity> {
    return this.cateRepo.create(data as CateEntity);
  }
}
