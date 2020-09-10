import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { CommonModule } from './domain/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdCateModule } from './domain/prod-cate/prod-cate.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProdModule } from './domain/prod/prod.module';
import { AddrController } from './domain/addr/addr.controller';
import { AddrModule } from './domain/addr/addr.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    CommonModule,
    ProdCateModule,
    ProdModule,
    AddrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
