import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';
import { RedisPublisher } from './redis.publisher';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (redisService: RedisService) => redisService.getClient(),
      inject: [RedisService],
    },
    RedisPublisher,
  ],
  exports: [RedisService, 'REDIS_CLIENT', RedisPublisher],
})
export class RedisModule {}
