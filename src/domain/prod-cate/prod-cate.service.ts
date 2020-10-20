import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { TreeRepository } from 'typeorm';

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

  async findAllByShop(shopId: number) {
    //todo 修改
    const cateRoot = await this.cateRepo.create({ id: 1 });
    const res = await this.cateRepo.findTrees();
    return res;
  }
}
