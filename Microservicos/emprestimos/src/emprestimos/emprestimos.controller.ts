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

@Controller()
export class EmprestimosController {
  constructor(private service: EmprestimosService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get('estatisticas')
  estatisticas() {
    return this.service.estatisticas();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id/devolver')
  devolver(@Param('id', ParseIntPipe) id: number) {
    return this.service.devolver(id);
  }

  @Post()
  create(@Body() dto: CreateEmprestimoDto) {
    return this.service.create(dto);
  }
}
