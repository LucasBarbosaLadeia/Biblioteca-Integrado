import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmprestimosModule } from './emprestimos/emprestimos.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { Emprestimo } from './emprestimos/Emprestimo.entity';
import { HttpModule } from './http/http.module';
import { ReservasModule } from './reservas/reservas.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          host: cfg.get('REDIS_HOST', 'localhost'),
          port: Number(cfg.get('REDIS_PORT', 6379)),
          password: cfg.get('REDIS_PASSWORD') || undefined,
        }),
        isGlobal: true,
        ttl: 60 * 60,
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: parseInt(cfg.get('DB_PORT', '5432')),
        username: cfg.get('DB_USER', 'root'),
        password: cfg.get('DB_PASSWORD', 'root'),
        database: cfg.get('DB_NAME', 'usersdb'),
        entities: [Emprestimo],
        synchronize: true, // DEV only
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    EmprestimosModule,
    HttpModule,
    ReservasModule,
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (cfg: ConfigService) => {
        // require here to avoid types/emission issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Redis = require('ioredis');
        return new Redis({
          host: cfg.get('REDIS_HOST', 'localhost'),
          port: Number(cfg.get('REDIS_PORT', 6379)),
          password: cfg.get('REDIS_PASSWORD') || undefined,
        });
      },
      inject: [ConfigService],
    } as Provider,
  ],
})
export class AppModule {}
