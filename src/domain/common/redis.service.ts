import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
@Injectable()
export class Redis {
  constructor(private redisService: RedisService) {
    this.client = redisService.getClient();
  }
  private client;

  async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!seconds) this.client.set(key, value);
  }
}
