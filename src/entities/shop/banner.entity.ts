import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity()
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img: string;

  @ManyToOne(type => ShopEntity, shop => shop.banners)
  shop: ShopEntity;
}
