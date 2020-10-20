import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @CreateDateColumn()
  created: Date;
  @UpdateDateColumn()
  updated: Date;
}
