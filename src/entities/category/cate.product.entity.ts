import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  TreeParent,
  TreeChildren,
  Tree,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ProductEntity } from '../product/prdouct.entity';
import { ShopEntity } from '../shop/shop.entity';

@Entity('product_cate')
@Tree('materialized-path')
export class CateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'tinyint', default: 1 }) // 1. 1级 2.2级  3.3级
  level: number;

  @Column({ default: '' })
  img: string;

  @Column({ type: 'varchar', length: 20 })
  pid: string; // pid 原始的id

  @TreeParent()
  parent: CateEntity;

  @TreeChildren()
  children: CateEntity[];

  @ManyToMany(type => ProductEntity, p => p.cates)
  @JoinTable()
  prods: ProductEntity[];

  @Column({ type: 'tinyint', nullable: true })
  shopId: number;

  @ManyToOne(type => ShopEntity)
  @JoinColumn()
  shop: ShopEntity;
}
