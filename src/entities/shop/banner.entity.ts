import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, default: '' })
  img: string;

  @Column({ type: 'varchar', length: 200, default: '' })
  url: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  shopId: number;

  @Column({ type: 'tinyint', default: 1, unsigned: true, nullable: true, comment: '区分作用' })
  type: number;
}
