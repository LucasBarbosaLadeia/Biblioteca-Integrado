import { Injectable } from '@nestjs/common';

@Injectable()
export class EmprestimosService {
  hello() {
    return 'Hello Emprestimos!';
  }

  getHello(): string {
    return 'Microservice Emprestimos Funcionando!';
  }
}
