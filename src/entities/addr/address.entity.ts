import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from '../user.entity';
import { Expose, Exclude, classToPlain } from 'class-transformer';
import { BasePostAddr } from './addr.base.entity';

@Entity()
export class AddrPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  default: boolean;

  @Column(type => BasePostAddr)
  addr: BasePostAddr;

  @Exclude()
  @ManyToOne(type => UserEntity, u => u.address)
  user: UserEntity;

  @Expose({ name: 'address' })
  address() {
    return this.addr.province + this.addr.city + this.addr.county + this.addr.area;
  }

  toJson() {
    return classToPlain(this);
  }
}
