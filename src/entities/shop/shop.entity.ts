import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItemEntity } from '../cart.entity';
import { ProductEntity } from '../product/prdouct.entity';
import { BannerEntity } from './banner.entity';

@Entity('ygh_m_shop')
export class ShopEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'tinyint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '拼音或英文' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '中文名字', nullable: true })
  cname: string;

  @Column({ type: 'varchar', length: 5, comment: '标识符', nullable: true })
  code: string;

  @Column({ type: 'tinyint', default: 100, comment: '排序作用' })
  sort: number;

  @Column({ type: 'tinyint', default: 2, comment: '一级排序' })
  level: number;

  @Column({ type: 'smallint', comment: '运费' })
  freight: number;

  @Column({ type: 'smallint', comment: '免运费价格' })
  nfPrice: number;

  @Column({ type: 'varchar', length: 30, comment: '满减字符串,单位为元末尾不能`;`,例:"80:5;100:10"', default: '' })
  discountStr: string;

  @Column({ type: 'varchar', comment: 'logo' })
  logo: string;

  @Column({ type: 'varchar', comment: '背景图片,商城展示使用' })
  bg: string;

  @Column({ type: 'varchar', length: 100, comment: '商家通知' })
  notice: string;

  @Column({ comment: '该商店是否需要分类', default: true })
  isCate: boolean;

  @Column({ type: 'varchar', length: 50, comment: '商户信用代码', default: '' })
  creditCode: string;

  cart: CartitemVo[];
}

class CartitemVo {
  number: string;
  shopId: string;
  pname: string;
}
