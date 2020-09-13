import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity("banners")
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, default: "" })
  img: string;

  @Column({ nullable: true })
  shopId: number;
}
