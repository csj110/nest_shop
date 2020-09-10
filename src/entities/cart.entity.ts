import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cart_prod')
export class CartItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  pid: string;

  @Column()
  number: string;
  
  @Column()
  price: number;

  @Column()
  @Index()
  shop: string;
}
