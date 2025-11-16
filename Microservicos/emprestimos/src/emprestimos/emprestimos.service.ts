import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    // Verifica se o usuário existe
    await this.httpService.getUsuario(id_usuario).catch(() => {
      console.log(dataDev);
      throw new NotFoundException('Usuário não encontrado');
    });

    // Verifica se o livro existe
    const livro = await this.httpService.getLivro(id_livro).catch(() => {
      throw new NotFoundException('Livro não encontrado');
    });

    // Verifica se já existe empréstimo ativo para o usuário e livro
    const emprestimoAtivo = await this.repo.findOne({
      where: { id_usuario, id_livro, status: 'ativo' },
    });

    if (emprestimoAtivo) {
      throw new BadRequestException(
        'Empréstimo ativo já existe para este usuário e livro',
      );
    }

    // Verifica reserva
    let reserva: Reserva | null = null;
    try {
      const r = await this.httpService.verificarReserva(id_usuario, id_livro);
      reserva = r.data;
    } catch {
      reserva = null;
    }

    // Se não houver reserva, verifica estoque
    if (!reserva && livro.data.qt_atual <= 0) {
      throw new BadRequestException('Livro não disponível para empréstimo.');
    }

    // Valida data de devolução prevista
    const hoje = new Date();
    const dataDev = new Date(data_devolucao_prevista);
    if (dataDev <= hoje) {
      throw new BadRequestException(
        'Data de devolução prevista deve ser futura',
      );
    }

    // Cria empréstimo
    const novoEmprestimo = this.repo.create({
      id_usuario,
      id_livro,
      data_emprestimo: new Date(),
      data_devolucao_prevista,
      status: 'ativo',
    });

    const savedEmprestimo = await this.repo.save(novoEmprestimo);

    // Atualiza reserva ou estoque
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

  async findAll() {
    return this.repo.find();
  }
}
