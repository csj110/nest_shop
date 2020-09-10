import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { Repository, FindManyOptions } from 'typeorm';

@Injectable()
export class ProdService {
  constructor(@InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>) {}

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
}

type Sort<T> = {
  [P in keyof T]?: 1 | -1;
};
