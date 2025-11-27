import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { CreateEmprestimoDto } from './dto/create-emprestimos.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('emprestimos')
@UseGuards(AuthGuard)
export class EmprestimosController {
  constructor(private emprestimosService: EmprestimosService) {}

  @Get()
  @Roles('funcionario', 'admin')
  getAll() {
    return this.emprestimosService.findAll();
  }

  @Get('estatisticas')
  @Roles('funcionario', 'admin')
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
  @Roles('funcionario', 'admin')
  devolver(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.devolver(id);
  }

  @Post()
  @Roles('funcionario', 'admin')
  create(@Body() dto: CreateEmprestimoDto) {
    return this.emprestimosService.create(dto);
  }
  // Reservation operations are exposed under the `reservas` controller
}
