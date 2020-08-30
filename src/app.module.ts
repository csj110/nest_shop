import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { CommonModule } from './domain/common/common.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { ArticleModule } from './domain/article/article.module';
import { CategoryModule } from './domain/category/category.module';


@Module({
  imports: [
    AuthModule, UserModule, CommonModule,
    TypeOrmModule.forRoot(),
    ArticleModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
