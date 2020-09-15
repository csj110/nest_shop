import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from 'src/entities/cart.entity';
import { CateEntity } from 'src/entities/category/cate.product.entity';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { Repository, TreeRepository, In, Any } from 'typeorm';
import { FindOptions, FindOptionsOrder } from 'typeorm/find-options/FindOptions';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>,
    @InjectRepository(CateEntity) private cateRepo: TreeRepository<CateEntity>,
    @InjectRepository(CartItemEntity) private cartRepo: Repository<CartItemEntity>
  ) { }

  async findOne(id: number) {
    return await this.prodRepo.findOne(id, { relations: ['detailImages'] });
  }

  async findAll(shopId: number, page: number, perPage: number, order?: FindOptionsOrder<ProductEntity>) {
    const query: FindOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shopId },
    };
    await this.prodRepo.find(query);
  }

  async findByCate(cateId: number, shopId: number, page: number, perPage: number, order?: FindOptionsOrder<ProductEntity>) {
    const cate = await this.cateRepo.findOne(cateId);
    const cateIds = (await this.cateRepo.findDescendants(cate)).filter(i => i.level == 3).map(i => i.id);
    const query: FindOptions<ProductEntity> = {
      select: ['price', 'pname', 'cover'],
      take: perPage,
      skip: perPage * (page - 1),
      order,
      where: { shopId: shopId, cateId: In(cateIds) },
    };
    console.log(query);
    return await this.prodRepo.find(query);
  }

}
