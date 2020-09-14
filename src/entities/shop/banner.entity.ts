import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  img: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  shopId: number;

  @Column({ nullable: true, comment: '区分作用' })
  type: number;
}
