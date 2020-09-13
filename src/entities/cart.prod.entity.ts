import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cartProd')
export class CartItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '商品图片' })
  image: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  pid: string;

  @Column({ type: 'tinyint' })
  number: string;

  @Column({ type: 'int' })
  price: number;

  @Column()
  @Index()
  shop: string;
}
