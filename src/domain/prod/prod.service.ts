import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, ProdSort } from 'src/dto/prod.dto';
import { CartItemEntity } from 'src/entities/cart.entity';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { Repository, TreeRepository, In, FindManyOptions } from 'typeorm';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CateEntity) private cateRepo: TreeRepository<CateEntity>,
    @InjectRepository(CartItemEntity) private cartRepo: Repository<CartItemEntity>
  ) {}

  async findOne(id: number) {
    return await this.prodRepo.findOne(id, { relations: ['detailImages', 'swipers'] });
  }

  async findAll(shopId: number, page: number, perPage: number, order?) {
    const query: FindManyOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover', 'shopId'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shopId, deprcated: false },
    };
    await this.prodRepo.find(query);
  }

  async findAllByShop(shopId: number, page: number, perPage: number, order: Order, sort: ProdSort) {
    const query: FindManyOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover', 'id', 'shopId'],
      take: perPage,
      skip: perPage * (page - 1),
      order: order && sort ? { [sort]: order } : { level: 1, sort: 1 },
      where: { shopId },
    };
    return await this.prodRepo.find(query);
  }

  async findByCate(cateId: number, shopId: number, page: number, perPage: number, order?) {
    const cate = await this.cateRepo.findOne(cateId);
    const cateIds = (await this.cateRepo.findDescendants(cate)).filter(i => i.level == 3).map(i => i.id);
    const query: FindManyOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shopId: shopId, cateId: In(cateIds) },
    };
    return await this.prodRepo.find(query);
  }
}
