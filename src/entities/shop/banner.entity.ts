import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity()
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img: string;

  @Column({ nullable: true })
  shopId: number;

  @ManyToOne(type => ShopEntity)
  @JoinColumn()
  shop: ShopEntity;
}
