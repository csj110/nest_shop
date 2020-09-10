import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from './prdouct.entity';
@Entity('shop_product_images')
export class ProductImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  sort: number;

  @ManyToOne(type => ProductEntity, p => p.detailImages)
  prod:ProductEntity
}
