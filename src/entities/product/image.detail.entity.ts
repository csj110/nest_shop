import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './prdouct.entity';

@Entity('ygh_m_detailimages')
export class DetailImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  url: string;

  @Column({ type: 'tinyint' })
  sort: number;

  @Column({ type: 'mediumint', unsigned: true, nullable: true })
  prodId: number;

  @ManyToOne(type => ProductEntity, p => p.detailImages)
  prod: ProductEntity;
}
