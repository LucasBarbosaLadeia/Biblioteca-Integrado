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
import { ReservaStatus } from '../reservas/reserva.entity';
import { ReservasService } from '../reservas/reservas.service';

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectRepository(Emprestimo)
    private readonly repo: Repository<Emprestimo>,
    private readonly httpService: HttpServiceMicro,
    private readonly reservasService: ReservasService,
  ) {}

  async create(dto: CreateEmprestimoDto) {
    const { id_usuario, id_livro, data_devolucao_prevista } = dto;

    await this.httpService.getUsuario(id_usuario).catch(() => {
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

    // check local reservations for this user and book
    const todas = await this.reservasService.listarTodas();
    const reserva =
      todas.find(
        (r) =>
          r.livroId === String(id_livro) &&
          r.alunoId === String(id_usuario) &&
          r.status === ReservaStatus.PENDENTE_RETIRADA,
      ) || null;

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
      reserva.status = ReservaStatus.RETIRADA;
      // Note: não decrementar estoque aqui pois já foi reservado quando criada
    } else {
      await this.httpService.decrementarEstoque(id_livro);
    }

    return savedEmprestimo;
  }

  // Delegate reservation creation to ReservasService
  async criarReserva(livroId: number, alunoId: number) {
    return this.reservasService.criarReserva(livroId, alunoId);
  }

  // Debug helper to list in-memory reservas
  listarReservasDebug() {
    return this.reservasService.listarTodas();
  }

  // Debug: consulta o backend para obter dados do livro
  async buscarLivroBackend(livroId: number) {
    return this.reservasService.buscarLivroBackend(livroId);
  }

  async retirarReserva(reservaId: string) {
    // delegate reservation validation & status update to ReservasService
    const reserva = await this.reservasService.retirarReserva(reservaId);

    // criar emprestimo a partir da reserva validada
    const dataPrev = new Date();
    dataPrev.setDate(dataPrev.getDate() + 7);

    const novoEmp = this.repo.create({
      id_usuario: Number(reserva.alunoId),
      id_livro: Number(reserva.livroId),
      data_emprestimo: new Date(),
      data_devolucao_prevista: dataPrev,
      status: 'ativo',
    });

    const saved = await this.repo.save(novoEmp);

    // link emprestimo na reserva (objeto retornado é a mesma referência em memória)
    reserva.emprestimoId = String(saved.id);

    // if reserva was from fila (posicaoFila not null), call next in queue
    if (reserva.posicaoFila) {
      await this.reservasService.chamarProximo(Number(reserva.livroId));
    }

    return { reserva, emprestimo: saved };
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

    // chamar próximo da fila via ReservasService
    try {
      await this.reservasService.chamarProximo(Number(emprestimo.id_livro));
    } catch (err) {
      console.error('Erro ao processar fila de reservas após devolução:', err);
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
