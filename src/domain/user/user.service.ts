import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Redis } from '../common/redis.service';
import { ProductEntity } from 'src/entities/product/prdouct.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, private redis: Redis) {}

  async findOrCreateUser(phone: string) {
    let user = await this.userRepo.findOne({ phone });
    if (!user) {
      user = await this.userRepo.create({ phone });
      await user.save();
    }
    return user;
  }

  async findUserByPhone(phone: string): Promise<UserEntity> {
    const key = `au:${phone}`;
    let user = await this.redis.get(key);
    if (!user) {
      user = await this.userRepo.findOne({ phone });
      user && (await this.redis.set(key, user, 60 * 10));
    }
    return user;
  }
}
