import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
@Entity('ygh_m_orderproducts')
export class OrderProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int' })
  price: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  cover: string;

  @Column({ type: 'tinyint', unsigned: true })
  quantity: number;

  @Column({ type: 'varchar', length: 30 }) // 对应产品的id
  pid: string;

  @ManyToOne(type => OrderEntity, order => order.products)
  order: OrderEntity[];
}
