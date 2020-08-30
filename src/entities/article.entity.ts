import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, JoinTable } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";

@Entity("articles")
export class ArticleEntity extends AbstractEntity {

  @Column({ nullable: false })
  title: string

  @ManyToOne(type => UserEntity, user => user.opus)
  @JoinColumn({ name: "author_id" })
  author: UserEntity

  @ManyToMany(type => CategoryEntity, cate => cate.articles)
  cate: CategoryEntity[]
}