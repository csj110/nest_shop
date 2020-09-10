import { Entity, Column, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

import { OrderEntity } from './order/order.entity';
import { ProductEntity } from './product/prdouct.entity';
import { AddrPostEntity } from './addr/address.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false, default: 'no name' })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @OneToMany(type => OrderEntity, order => order.user)
  orders: OrderEntity[];

  @ManyToMany(type => ProductEntity)
  @JoinTable()
  cart: ProductEntity[];

  @OneToMany(type => AddrPostEntity, addr => addr.user)
  address: AddrPostEntity[];
}
