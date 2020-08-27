import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { CommonModule } from './domain/common/common.module';

@Module({
  imports: [AuthModule, UserModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
