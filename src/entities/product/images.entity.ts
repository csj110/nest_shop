import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from './prdouct.entity';
@Entity('productImages')
export class ProductImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'tinyint' })
  sort: number;

  @ManyToOne(type => ProductEntity, p => p.detailImages)
  prod: ProductEntity;
}
