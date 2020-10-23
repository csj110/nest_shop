import { Entity, Column, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

import { OrderEntity } from './order/order.entity';
import { AddrPostEntity } from './addr/address.entity';
import { CartItemEntity } from './cart.entity';

@Entity('ygh_m_users')
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false, default: 'no name' })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  memberId: string;

  @OneToMany(type => OrderEntity, order => order.user)
  orders: OrderEntity[];

  @OneToMany(type => CartItemEntity, c => c.user)
  cart: CartItemEntity[];

  @OneToMany(type => AddrPostEntity, addr => addr.user)
  address: AddrPostEntity[];
}
