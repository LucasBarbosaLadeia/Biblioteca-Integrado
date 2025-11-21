import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprestimo } from './Emprestimo.entity';
import { EmprestimosService } from './emprestimos.service';
import { EmprestimosController } from './emprestimos.controller';
import { HttpModule } from 'src/http/http.module';
import { ReservasModule } from 'src/reservas/reservas.module';
import { RedisModule } from 'src/redis/redis.module';
//import { HealthController } from './health.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emprestimo]),
    HttpModule,
    ReservasModule,
    RedisModule,
  ],
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
})
export class EmprestimosModule {}
