import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('ygh_m_order_state_record')
export class OrderRecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'varchar', length: 100 })
  message: string;

  @ManyToOne(type => OrderEntity, order => order.records)
  order: OrderEntity;
}
