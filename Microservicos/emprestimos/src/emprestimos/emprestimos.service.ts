import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Emprestimo } from './Emprestimo.entity';
import { CreateEmprestimoDto } from './dto/create-emprestimos.dto';
import { HttpServiceMicro } from '../http/http.service';
import type { Reserva } from '../http/http.service';

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectRepository(Emprestimo)
    private readonly repo: Repository<Emprestimo>,
    private readonly httpService: HttpServiceMicro,
  ) {}

  async create(dto: CreateEmprestimoDto) {
    const { id_usuario, id_livro, data_devolucao_prevista } = dto;

    await this.httpService.getUsuario(id_usuario).catch(() => {
      console.log(dataDev);
      throw new NotFoundException('Usuário não encontrado');
    });

    const livro = await this.httpService.getLivro(id_livro).catch(() => {
      throw new NotFoundException('Livro não encontrado');
    });

    const emprestimoAtivo = await this.repo.findOne({
      where: { id_usuario, id_livro, status: 'ativo' },
    });

    if (emprestimoAtivo) {
      throw new BadRequestException(
        'Empréstimo ativo já existe para este usuário e livro',
      );
    }

    let reserva: Reserva | null = null;
    try {
      const r = await this.httpService.verificarReserva(id_usuario, id_livro);
      reserva = r.data;
    } catch {
      reserva = null;
    }

    if (!reserva && livro.data.qt_atual <= 0) {
      throw new BadRequestException('Livro não disponível para empréstimo.');
    }

    const hoje = new Date();
    const dataDev = new Date(data_devolucao_prevista);
    if (dataDev <= hoje) {
      throw new BadRequestException(
        'Data de devolução prevista deve ser futura',
      );
    }

    const novoEmprestimo = this.repo.create({
      id_usuario,
      id_livro,
      data_emprestimo: new Date(),
      data_devolucao_prevista,
      status: 'ativo',
    });

    const savedEmprestimo = await this.repo.save(novoEmprestimo);

    if (reserva) {
      await this.httpService.concretizarReserva(reserva.id_reserva);
    } else {
      await this.httpService.decrementarEstoque(id_livro);
    }

    return savedEmprestimo;
  }

  async findOne(id: number) {
    const emprestimo = await this.repo.findOne({ where: { id } });
    if (!emprestimo) throw new NotFoundException('Emprestimo not found');
    return emprestimo;
  }

  async devolver(id: number) {
    const emprestimo = await this.repo.findOne({ where: { id } });
    if (!emprestimo) throw new NotFoundException('Emprestimo não encontrado');

    if (emprestimo.status !== 'ativo') {
      throw new BadRequestException('Empréstimo não está ativo');
    }

    emprestimo.data_devolucao_real = new Date();
    emprestimo.status = 'devolvido';

    const saved = await this.repo.save(emprestimo);

    try {
      await this.httpService.incrementarEstoque(emprestimo.id_livro);
    } catch (err) {
      console.error('Erro ao incrementar estoque no backend:', err);
    }

    return saved;
  }

  async findAll() {
    return this.repo.find();
  }

  async estatisticas() {
    const total = await this.repo.count();
    const ativos = await this.repo.count({ where: { status: 'ativo' } });
    const devolvidos = await this.repo.count({
      where: { status: 'devolvido' },
    });
    const atrasados = await this.repo.count({
      where: {
        status: 'ativo',
        data_devolucao_prevista: LessThan(new Date()),
      },
    });

    return {
      total,
      ativos,
      devolvidos,
      atrasados,
    };
  }
}
