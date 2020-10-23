import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity('ygh_m_banners')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 300, default: '' })
  img: string;

  @Column({ type: 'varchar', length: 225, default: '' })
  url: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  shopId: number;

  @Column({ type: 'tinyint', default: 1, unsigned: true, nullable: true, comment: '区分作用' })
  type: number;

  @Column({ type: 'varchar', length: 50, default: '', comment: '额外附加信息' })
  detail: string;

  @Column({ type: 'varchar', length: 15, default: '', comment: '跳转模式' })
  mode: string;
}
