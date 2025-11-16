import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { CreateEmprestimoDto } from './dto/create-emprestimos.dto';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private service: EmprestimosService) {}

  @Post()
  create(@Body() dto: CreateEmprestimoDto) {
    return this.service.create(dto);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.findOne(id);
  }
}
