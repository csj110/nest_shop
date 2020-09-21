import { CONNREFUSED } from 'dns';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { CateEntity } from '../category/cate.product.entity';

import { DetailImageEntity } from './image.detail.entity';
import { SwiperEntity } from './swiper.prod.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  pid: string;

  @Column({ type: 'varchar', length: 50 })
  pname: string;

  @Column({ type: 'varchar', length: 200, comment: '封面图片', default: '' })
  cover: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'bool', comment: 'true:下架,false:上架', default: false })
  deprcated: boolean;

  @Column('smallint', { default: 3000 })
  inventory: number;

  @OneToMany(type => DetailImageEntity, image => image.prod)
  detailImages: DetailImageEntity[];

  @OneToMany(type => SwiperEntity, s => s.prod)
  swipers: SwiperEntity[];

  @ManyToOne(type => CateEntity, cate => cate.prods)
  cate: CateEntity;

  @Column({ type: 'mediumint', unsigned: true, nullable: true })
  cateId: number;

  @Column({ nullable: true })
  shopId: number;

  @Column({ type: 'tinyint', unsigned: true, nullable: true, default: 3, comment: '商品排序等级1 最高' })
  level: number;

  @Column({ type: 'tinyint', unsigned: true, nullable: true, default: 1, comment: '商品排序标准2 等级1 最高' })
  sort: number;
}
