import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ExpireReservasJob } from './jobs/expire-reservas.job';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('reservas')
@UseGuards(AuthGuard)
export class ReservasController {
  constructor(
    private readonly service: ReservasService,
    private readonly expireJob: ExpireReservasJob,
  ) {}

  @Post('retirar/:id')
  @Roles('funcionario', 'admin')
  retirar(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.service.retirarReserva(id);
  }

  @Post(':livroId/:usuarioId')
  criar(
    @Param('livroId', ParseIntPipe) livroId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.service.criarReserva(livroId, usuarioId);
  }

  @Get()
  @Roles('funcionario', 'admin')
  listar() {
    return this.service.listarTodas();
  }

  @Get('usuario/:usuarioId')
  listarPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.service.listarPorUsuario(usuarioId);
  }

  @Delete(':livroId/:usuarioId')
  cancelar(
    @Param('livroId', ParseIntPipe) livroId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.service.cancelarReserva(livroId, usuarioId);
  }

  /**
   * Endpoint para forçar execução manual do job de expiração
   * Útil para testes e manutenção
   */
  @Post('jobs/expire-manual')
  @Roles('funcionario', 'admin')
  async executeExpireJob() {
    const result = await this.expireJob.executeManual();
    return {
      success: true,
      message: 'Job de expiração executado manualmente',
      ...result,
    };
  }
}
