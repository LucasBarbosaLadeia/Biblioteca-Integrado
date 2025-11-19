import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { HttpModule } from 'src/http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Emprestimo } from '../emprestimos/Emprestimo.entity';
import { ReservaFila } from './reserva_fila.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Reserva, Emprestimo, ReservaFila]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
