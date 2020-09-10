import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
@Entity('order_products')
export class OrderProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  quantity: number;

  @Column() // 对应产品的id
  pid: number;

  @ManyToOne(type => OrderEntity, order => order.products)
  order: OrderEntity[];
}
