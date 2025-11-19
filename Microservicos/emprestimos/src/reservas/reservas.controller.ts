import {
  Controller,
  Post,
  Param,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Post('retirar/:id')
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
  listar() {
    return this.service.listarTodas();
  }
}
