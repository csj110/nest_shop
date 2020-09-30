import { Column, ManyToOne, JoinColumn, Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { ProductEntity } from './prdouct.entity';

@Entity('swipers')
export class SwiperEntity {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'tinyint' })
  sort: number;

  @Column({ type: 'mediumint', unsigned: true, nullable: true })
  prodId: number;

  @ManyToOne(type => ProductEntity, p => p.swipers)
  prod: ProductEntity;
}
