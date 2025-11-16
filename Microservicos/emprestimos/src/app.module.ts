import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmprestimosModule } from './emprestimos/emprestimos.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { Emprestimo } from './emprestimos/Emprestimo.entity';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
      }),
      inject: [ConfigService],
    }),
    EmprestimosModule,
    HttpModule,
  ],
})
export class AppModule {}
