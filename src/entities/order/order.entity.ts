import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../user.entity';
import { OrderProductEntity } from './order.product.entity';
import { AbstractEntity } from '../abstract.entity';
import { AddrPostEntity } from '../addr/address.entity';
import { classToPlain, Expose } from 'class-transformer';

import { OrderRecordEntity } from './order.state.revord';

export enum OrderState {
  CREATED = 1,
  PAYED = 2,
  DELIVERIED = 3,
  FINISHED = 4,
  CANCELED = -1,
}

@Entity('orders')
export class OrderEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 8 })
  province: string;

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ type: 'varchar', length: 20 })
  county: string;

  @Column({ type: 'varchar', length: 40 })
  area: string;
  @Column({ name: 'receiver_name', type: 'varchar', length: '15' })
  receivername: string;

  @Column({ name: 'receiver_phone', type: 'varchar', length: '20' })
  receiverphone: string;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.CREATED,
    comment: '//1.创建,2.已支付,3.以发货,4.已完成,-1.已取消',
  })
  state: number;

  @Column({ type: 'int', unsigned: true })
  price: number;

  @Column({ type: 'smallint', unsigned: true })
  freight: number;

  @Column({ type: 'varchar', length: 50 })
  oid: string;

  @Expose({ name: 'address' })
  get address() {
    return this.province + this.city + this.county + this.area;
  }

  @ManyToOne(type => AddrPostEntity)
  @JoinColumn()
  addr: AddrPostEntity;

  @ManyToOne(type => UserEntity, user => user.orders)
  user: UserEntity;

  @OneToMany(type => OrderProductEntity, orderProduct => orderProduct.order)
  products: OrderProductEntity[];

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  shopId: number;

  @OneToMany(type => OrderRecordEntity, record => record.order)
  records: OrderRecordEntity[];

  toJson() {
    return classToPlain(this);
  }
}
