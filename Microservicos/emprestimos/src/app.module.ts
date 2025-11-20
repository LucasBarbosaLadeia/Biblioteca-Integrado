import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmprestimosModule } from './emprestimos/emprestimos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Emprestimo } from './emprestimos/Emprestimo.entity';
import { HttpModule } from './http/http.module';
import { ReservasModule } from './reservas/reservas.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        const host = cfg.get('REDIS_HOST') || 'redis';
        const port = Number(cfg.get('REDIS_PORT') || 6379);

        console.log(`🔧 [REDIS CONFIG] Conectando: ${host}:${port}`);

        try {
          const store = await redisStore({
            host,
            port,
          });

          console.log('✅ [REDIS CONFIG] Store criado com sucesso');
          return { store, ttl: 300000 }; // 5 minutos default
        } catch (error) {
          console.error('❌ [REDIS CONFIG] Erro ao criar store:', error);
          throw error;
        }
      },
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
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    EmprestimosModule,
    HttpModule,
    ReservasModule,
  ],
})
export class AppModule {}
