import { Controller, Get } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly service: EmprestimosService) {}

  @Get()
  hello() {
    return this.service.hello();
  }

  @Get('status')
  getStatus(): string {
    return this.service.getHello();
  }
}
