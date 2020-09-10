import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from '../user.entity';
import { Expose, Exclude, classToPlain } from 'class-transformer';

@Entity()
export class AddrPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  county: string;

  @Column()
  area: string;

  @Column({ default: false })
  default: boolean;

  @Column({ name: 'receiver_name' })
  receivername: string;

  @Column({ name: 'receiver_phone' })
  receiverphone: string;

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
