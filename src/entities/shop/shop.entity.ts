import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/prdouct.entity';
import { BannerEntity } from './banner.entity';
@Entity('shop')
export class ShopEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @OneToMany(type => ProductEntity, p => p.shop)
  prods: ProductEntity[];

  @OneToMany(type => BannerEntity, b => b.shop)
  banners;
}
