import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprestimo } from './Emprestimo.entity';
import { EmprestimosService } from './emprestimos.service';
import { EmprestimosController } from './emprestimos.controller';
import { HttpModule } from 'src/http/http.module';
//import { HealthController } from './health.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Emprestimo]), HttpModule],
  controllers: [EmprestimosController],
  providers: [EmprestimosService, HttpModule],
})
export class EmprestimosModule {}
