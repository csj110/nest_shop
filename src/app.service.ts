import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CateEntity } from './entities/category/cate.product.entity';
import { ShopEntity } from './entities/shop/shop.entity';
import { a } from '../a';
import { ProductEntity } from './entities/product/prdouct.entity';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CateEntity) private cateRepo: TreeRepository<CateEntity>,
    @InjectRepository(ShopEntity) private shopRepo: Repository<ShopEntity>,
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>
  ) {}

  async load() {
    const src = [
      {
        category_id: 2,
        category_name: '酒水饮料',
        level: 1,
      },
      {
        category_id: 3,
        category_name: '粮油副食',
        level: 1,
      },
      {
        category_id: 4,
        category_name: '肉禽蛋品',
        level: 1,
      },
      {
        category_id: 5,
        category_name: '熟食面点',
        level: 1,
      },
    ];

    const src1 = [
      {
        category_id: 6,
        category_name: '冲饮品',
        parent_id: 2,
        level: 2,
      },
      {
        category_id: 7,
        category_name: '茶',
        parent_id: 2,
        level: 2,
      },
      {
        category_id: 8,
        category_name: '饮料',
        parent_id: 2,
        level: 2,
      },
      {
        category_id: 9,
        category_name: '养生',
        parent_id: 2,
        level: 2,
      },
      {
        category_id: 10,
        category_name: '南北干货',
        parent_id: 3,
        level: 2,
      },
      {
        category_id: 11,
        category_name: '米面杂粮',
        parent_id: 3,
        level: 2,
      },
      {
        category_id: 12,
        category_name: '食用油',
        parent_id: 3,
        level: 2,
      },
      {
        category_id: 13,
        category_name: '罐头',
        parent_id: 3,
        level: 2,
      },
    ];
    const src2 = [
      {
        category_id: 13,
        category_name: '蜂蜜',
        parent_id: 6,
        level: 3,
      },
      {
        category_id: 14,
        category_name: '其他',
        parent_id: 6,
        level: 3,
      },
      {
        category_id: 15,
        category_name: '麦片/谷物类',
        parent_id: 6,
        level: 3,
      },
      {
        category_id: 16,
        category_name: '干菌菇类',
        parent_id: 10,
        level: 3,
      },
      {
        category_id: 17,
        category_name: '大米',
        parent_id: 10,
        level: 3,
      },
      {
        category_id: 18,
        category_name: '粉丝腐竹类',
        parent_id: 10,
        level: 3,
      },
      {
        category_id: 19,
        category_name: '干货礼盒',
        parent_id: 10,
        level: 3,
      },
      {
        category_id: 20,
        category_name: '其他干货',
        parent_id: 10,
        level: 3,
      },
    ];
    let shop = await this.shopRepo.findOne({ name: 'Cai' });

    // for (let i of src) {
    //   await this.cateRepo.save({ name: i.category_name, level: i.level, pid: i.category_id, shopId: shop.id });
    //   console.log(i);
    // }
    // console.log('2');
    // for (const i of src1) {
    //   const cateP = await this.cateRepo.findOne({ shopId: shop.id, pid: i.parent_id });
    //   if (!cateP) return;
    //   await this.cateRepo.save({
    //     name: i.category_name,
    //     level: i.level,
    //     pid: i.category_id,
    //     shopId: shop.id,
    //     parent: cateP,
    //   });
    // }

    // for (const i of src2) {
    //   const cateP = await this.cateRepo.findOne({ shopId: shop.id, pid: i.parent_id });
    //   if (!cateP) return;
    //   await this.cateRepo.save({
    //     name: i.category_name,
    //     level: i.level,
    //     pid: i.category_id,
    //     shopId: shop.id,
    //     parent: cateP,
    //   });
    // }
  }

  async findAll() {
    const res = await this.cateRepo.find({ where: { parent: null, shopId: 1 } });
    let resList = [];
    for (const i of res) {
      resList.push(await this.cateRepo.findDescendantsTree(i));
    }
    return resList;
  }

  @Timeout(2000)
  async loadProd() {
    const cates = await this.cateRepo.find({ where: { level: 3 } });
    for (let i = 0; i < 2; i++) {
      const p = a[i];
      const prod:ProductEntity = await this.prodRepo.save({
        pid: p.spuId,
        pname: p.name,
        price: parseInt(p.spuId) * 100,
        cover: p.listPicUrl,
        shopId: 1,
      });

      const index = Math.floor(Math.random() * cates.length);

      const cateAnsList = await this.cateRepo.findAncestors(cates[index]);

      prod.cates = [...cateAnsList, cates[index]];
      await prod.save();
    }
  }
}
