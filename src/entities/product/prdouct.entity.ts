import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductImageEntity } from './images.entity';

@Entity('shop_products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pid: string;

  @Column()
  shop: string;

  @Column()
  pname: string;
  
  @Column()
  cover: string;

  @Column()
  vendor: string;

  @Column()
  price: number;

  @Column()
  deprcated: boolean;

  @Column('int')
  inventory: number;

  @OneToMany(type => ProductImageEntity, image => image.prod)
  detailImages: ProductImageEntity[];
}
