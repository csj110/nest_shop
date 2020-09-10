import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  TreeParent,
  TreeChildren,
  Tree,
} from 'typeorm';

@Entity('product_cate')
@Tree("closure-table")
export class CateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 1 }) // 1. 1级 2.2级  3.3级
  level: number;

  @Column({ default: '' })
  img: string;

  @TreeParent()
  parent: CateEntity;

  @TreeChildren()
  children: CateEntity[];
}
