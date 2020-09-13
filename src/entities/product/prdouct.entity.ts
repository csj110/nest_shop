import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CateEntity } from '../category/cate.product.entity';

import { ProductImageEntity } from './images.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  pid: string;

  @Column({ type: 'varchar', length: 50 })
  pname: string;

  @Column({ comment: '封面图片', default: "" })
  cover: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'bool', comment: 'true:下架,false:上架', default: false })
  deprcated: boolean;

  @Column('smallint', { default: 3000 })
  inventory: number;

  @OneToMany(type => ProductImageEntity, image => image.prod)
  detailImages: ProductImageEntity[];

  @ManyToOne(type => CateEntity, cate => cate.prods)
  cate: CateEntity;

  @Column({ type: "smallint", nullable: true })
  cateId: number;

  @Column({ type: "tinyint", nullable: true })
  shopId: number;
}
