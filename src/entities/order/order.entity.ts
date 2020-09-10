import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../user.entity';
import { OrderProductEntity } from './order.product.entity';
import { AbstractEntity } from '../abstract.entity';
import { AddrPostEntity } from '../addr/address.entity';

@Entity('shop_orders')
export class OrderEntity extends AbstractEntity {

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  county: number;

  @Column()
  area: string;

  @Column({ name: 'receiver_name' })
  receivername: string;

  @Column({ name: 'receiver_phone' })
  receiverphone: string;

  @Column() //1 创建 ,2 已确认 ,3 以发货, 4 已完成 , -1 已取消
  state: number;

  @Column()
  price: number;

  @Column()
  freight: number;

  total = this.price + this.freight;

  @ManyToOne(type => AddrPostEntity)
  @JoinColumn()
  addr: AddrPostEntity;

  @ManyToOne(type => UserEntity, user => user.orders)
  user: UserEntity;

  @OneToMany(type => OrderProductEntity, orderProduct => orderProduct.order)
  products: OrderProductEntity[];
}
