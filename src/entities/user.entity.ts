import { Entity, Column, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { type } from "os";
import { ArticleEntity } from "./article.entity";

@Entity('users')
export class UserEntity extends AbstractEntity {

  @Column({ nullable: false, unique: true })
  name: string

  @Column({ nullable: false })
  phone: string

  @OneToMany(type => ArticleEntity, article => article.author)
  opus: ArticleEntity[]
}