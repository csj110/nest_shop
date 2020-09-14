import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product/prdouct.entity';
import { UserEntity } from './user.entity';

@Entity('cartItem')
@Index(['userId', 'shopId'])
export class CartItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unsigned: true, nullable: true })
  userId: number;

  @ManyToOne(type => UserEntity, user => user.cart)
  @JoinColumn()
  user: UserEntity;

  @Column()
  number: number;

  @Column({ type: 'mediumint', unsigned: true, nullable: true })
  prodId: number;

  @ManyToOne(type => ProductEntity, { eager: true })
  @JoinColumn()
  prod: ProductEntity;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  shopId: number;
}
