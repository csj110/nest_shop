import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

// @Injectable()
export class Redis {
  constructor(private redisService: RedisService) {
    this.getClient()
  }
  async getClient() {
    this.client = await this.redisService.getClient();
  }
  private client;

  async set(key: string, value: any, seconds?: number): Promise<any> {
    if (!this.client) await this.getClient();
    value = JSON.stringify(value);
    if (!seconds) return await this.client.set(key, value);
    await this.client.set(key, value, 'EX', seconds);
  }

  async get(key: string) {
    if (!this.client) await this.getClient();
    var data = await this.client.get(key);
    if (!data) return;
    return JSON.parse(data);
  }

  async remove(key: string) {
    if (!this.client) await this.getClient();
    await this.client.del(key)
  }
}
