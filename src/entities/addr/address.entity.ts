import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from '../user.entity';
import { Expose, Exclude, classToPlain } from 'class-transformer';
import { BasePostAddr } from './addr.base.entity';

@Entity('addrpost')
export class AddrPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

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

  @Column({ default: false })
  default: boolean;

  @Column({ name: 'areaCode', type: 'varchar', length: 6, default: false })
  areaCode: string;

  @Exclude()
  @ManyToOne(type => UserEntity, u => u.address)
  user: UserEntity;

  @Expose({ name: 'address' })
  address() {
    return this.province + this.city + this.county + this.area;
  }

  toJson() {
    return classToPlain(this);
  }
}
