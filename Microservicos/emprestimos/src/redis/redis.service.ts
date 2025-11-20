/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;
  private pub: Redis;
  private sub: Redis;
  private sub2: Redis;

  constructor(cfg: ConfigService) {
    const host = cfg.get('REDIS_HOST') || 'redis';
    const port = parseInt(cfg.get('REDIS_PORT') || '6379');

    console.log(`[REDIS SERVICE] Conectando ao Redis: ${host}:${port}`);

    const config = {
      host,
      port,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    this.client = new IORedis(config);
    this.pub = new IORedis(config);
    this.sub = new IORedis(config);
    this.sub2 = new IORedis(config);

    this.client.on('connect', () => {
      console.log('[REDIS SERVICE] ✅ Redis Client conectado com sucesso');
    });

    this.client.on('error', (err) => {
      console.error('[REDIS SERVICE] ❌ Erro no Redis Client:', err.message);
    });

    this.pub.on('connect', () => {
      console.log('[REDIS SERVICE] ✅ Redis Publisher conectado com sucesso');
    });

    this.sub.on('connect', () => {
      console.log('[REDIS SERVICE] ✅ Redis Subscriber conectado com sucesso');
    });
  }

  async onModuleDestroy() {
    await this.pub.quit();
    await this.sub.quit();
  }

  getClient() {
    return this.client;
  }

  getPublisher() {
    return this.pub;
  }

  getSubscriber() {
    return this.sub;
  }

  getSubscriber2() {
    return this.sub2;
  }
}
