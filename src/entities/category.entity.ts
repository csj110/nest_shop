import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, JoinTable, BaseEntity } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { features } from "process";
import { ArticleEntity } from "./article.entity";


@Entity("cate_article")
export class CategoryEntity extends BaseEntity {

  @PrimaryGeneratedColumn("increment")
  id: string;

  @Column({ nullable: false, unique: true })
  name: string

  @ManyToMany(type => ArticleEntity, article => article.cate)
  @JoinTable()
  articles: ArticleEntity[]
}