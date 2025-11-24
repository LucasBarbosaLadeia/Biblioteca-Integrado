import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { HttpModule } from 'src/http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Emprestimo } from '../emprestimos/Emprestimo.entity';
import { ReservaFila } from './reserva_fila.entity';
import { RedisModule } from '../redis/redis.module';
import { ExpireReservasJob } from './jobs/expire-reservas.job';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Reserva, Emprestimo, ReservaFila]),
    RedisModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService, ExpireReservasJob],
  exports: [ReservasService],
})
export class ReservasModule {}
