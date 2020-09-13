import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { a } from 'a';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { Repository, FindManyOptions, TreeRepository, In } from 'typeorm';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CateEntity) private cateRepo: TreeRepository<CateEntity>,
  ) { }

  async findOne(id: number) {
    await this.prodRepo.findOne(id, { relations: ['detailImages'] });
  }

  async findAll(shop: string, page: number, perPage: number, order?: Sort<ProductEntity>) {
    const query: FindManyOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shop },
    };
    await this.prodRepo.find(query);
  }


  async findByCate(cateId: number, shopId: number, page: number, perPage: number, order?: Sort<ProductEntity>) {
    const cate = await this.cateRepo.findOne(cateId)
    const cates = (await this.cateRepo.findDescendants(cate)).filter(i => i.level == 3)
    const query: FindManyOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shopId: shopId, cate: In(cates) },
    };
    return await this.prodRepo.find(query)
  }
}

type Sort<T> = {
  [P in keyof T]?: 1 | -1;
};
