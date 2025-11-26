import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { CreateEmprestimoDto } from './dto/create-emprestimos.dto';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private emprestimosService: EmprestimosService) {}

  @Get()
  getAll() {
    return this.emprestimosService.findAll();
  }

  @Get('estatisticas')
  estatisticas() {
    return this.emprestimosService.estatisticas();
  }

  @Get('usuario/:usuarioId')
  getByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.emprestimosService.findByUsuario(usuarioId);
  }

  @Get('debug/reservas')
  debugReservas() {
    return this.emprestimosService.listarReservasDebug();
  }

  @Get('debug/livro/:id')
  async debugLivro(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.buscarLivroBackend(id);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.findOne(id);
  }

  @Put(':id/devolver')
  devolver(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.devolver(id);
  }

  @Post()
  create(@Body() dto: CreateEmprestimoDto) {
    return this.emprestimosService.create(dto);
  }
  // Reservation operations are exposed under the `reservas` controller
}
