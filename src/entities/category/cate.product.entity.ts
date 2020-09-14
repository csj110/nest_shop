import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, TreeParent, TreeChildren, Tree, OneToMany } from 'typeorm';
import { ProductEntity } from '../product/prdouct.entity';

@Entity('cate')
@Tree('materialized-path')
export class CateEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'tinyint', unsigned: true, default: 1 }) // 1. 1级 2.2级  3.3级
  level: number;

  @Column({ default: '' })
  img: string;

  @Column({ type: 'varchar', length: 20 })
  pid: string; // pid 原始的id

  @TreeParent()
  parent: CateEntity;

  @TreeChildren()
  children: CateEntity[];

  @OneToMany(() => ProductEntity, p => p.cate)
  prods: ProductEntity[];

  @Column({ type: 'tinyint', nullable: true })
  shopId: number;
}
