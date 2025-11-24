import { Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { FilaService } from './fila.service';

@Controller('fila')
export class FilaController {
  constructor(private readonly filaService: FilaService) {}

  @Get('estatisticas')
  async obterEstatisticas() {
    return this.filaService.obterEstatisticas();
  }

  @Get('falhos')
  async obterEventosFalhos(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.filaService.obterEventosFalhos(limitNum);
  }

  @Post('reprocessar/:id')
  async reprocessarEvento(@Param('id') id: string) {
    await this.filaService.reprocessarEvento(id);
    return { success: true, message: 'Evento marcado para reprocessamento' };
  }

  @Delete('limpar')
  async limparEventosConcluidos(@Query('dias') dias?: string) {
    const diasNum = dias ? parseInt(dias, 10) : 7;
    const deletados = await this.filaService.limparEventosConcluidos(diasNum);
    return { success: true, deletados };
  }
}
