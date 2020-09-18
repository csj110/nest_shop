import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItemEntity } from '../cart.entity';
import { ProductEntity } from '../product/prdouct.entity';
import { BannerEntity } from './banner.entity';

@Entity('shop')
export class ShopEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'tinyint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '拼音或英文' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '中文名字', nullable: true })
  cname: string;

  @Column({ type: 'varchar', length: 5, comment: '标识符', nullable: true })
  code: string;

  cart: CartitemVo[];
}

class CartitemVo {
  number: string;
  shopId: string;
  pname: string;
}
