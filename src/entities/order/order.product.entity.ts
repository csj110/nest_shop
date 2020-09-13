import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
@Entity('orderProducts')
export class OrderProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  price: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  image: string;

  @Column({ type: 'tinyint' })
  quantity: number;

  @Column({ type: 'varchar', length: 30 }) // 对应产品的id
  pid: string;

  @ManyToOne(type => OrderEntity, order => order.products)
  order: OrderEntity[];
}
