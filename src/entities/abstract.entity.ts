import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Exclude()
  @CreateDateColumn()
  created: Date;
  @Exclude()
  @UpdateDateColumn()
  updated: Date;
}
