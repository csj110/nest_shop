import { Module, Global } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { Redis } from './redis.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

const options = {
  port: 6379,
  host: '127.0.0.1',
  password: '',
  db: 0,
  keyPrefix: 'nest:',
};

@Global()
@Module({
  imports: [
    RedisModule.register(options),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWTSECRET,
        signOptions: { expiresIn: '2h' },
      }),
    }),
    UserModule,
  ],
  providers: [Redis, JwtStrategy],
  exports: [Redis, PassportModule, JwtStrategy, JwtModule],
})
export class CommonModule {}
