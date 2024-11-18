import { Controller, Get, Inject } from '@nestjs/common';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cacheManger: Cache) {}

  @Get('version')
  async getVersion(): Promise<any> {
    const version = process.env.VERSION;
    const res = await this.cacheManger.get('version');
    await this.cacheManger.set('version', version || 'v1');
    return {
      version: res || version,
    };
  }
}
