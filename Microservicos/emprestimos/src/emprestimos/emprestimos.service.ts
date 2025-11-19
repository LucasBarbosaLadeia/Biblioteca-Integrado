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
import { Reserva, ReservaStatus } from './Reserva.entity';

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectRepository(Emprestimo)
    private readonly repo: Repository<Emprestimo>,
    private readonly httpService: HttpServiceMicro,
  ) {}

  // In-memory reservations for this microservice
  private reservas: Reserva[] = [];

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
    const reserva =
      this.reservas.find(
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

  // Create reservation endpoint logic inside microservice
  async criarReserva(livroId: number, alunoId: number) {
    // validar livro/usuario via backend
    await this.httpService.getUsuario(alunoId).catch(() => {
      throw new NotFoundException('Usuário não encontrado');
    });
    const livro = await this.httpService.getLivro(livroId).catch(() => {
      throw new NotFoundException('Livro não encontrado');
    });

    // Prevent the same user from reserving the same book more than once
    const jaTemReserva = this.reservas.find(
      (r) =>
        r.livroId === String(livroId) &&
        r.alunoId === String(alunoId) &&
        (r.status === ReservaStatus.NA_FILA ||
          r.status === ReservaStatus.PENDENTE_RETIRADA ||
          r.status === ReservaStatus.DISPONIVEL_PARA_COLETA),
    );

    if (jaTemReserva) {
      throw new BadRequestException(
        'Usuário já possui uma reserva para este livro',
      );
    }

    // Prevent reserving if user already has an active loan for this book
    const emprestimoAtivo = await this.repo.findOne({
      where: { id_usuario: alunoId, id_livro: livroId, status: 'ativo' },
    });
    if (emprestimoAtivo) {
      throw new BadRequestException(
        'Usuário já possui um empréstimo ativo para este livro',
      );
    }

    // backend may return either { qt_atual } directly or a wrapper { success, data: { qt_atual } }
    const maybeWrapper: unknown = livro.data;
    let nested: unknown;
    if (
      typeof maybeWrapper === 'object' &&
      maybeWrapper !== null &&
      'data' in (maybeWrapper as Record<string, unknown>)
    ) {
      nested = (maybeWrapper as Record<string, unknown>).data;
    } else {
      nested = maybeWrapper;
    }

    const rawQt =
      nested && typeof nested === 'object'
        ? (nested as Record<string, unknown>)['qt_atual']
        : undefined;
    const qt = Number(rawQt ?? 0);
    console.log(`Livro ${livroId} qt_atual (backend): ${qt}`);

    if (qt > 0) {
      console.log(`criarReserva: qt=${qt} > 0 -> criando PENDENTE_RETIRADA`);
      // reservar imediatamente: decrementar estoque no backend e criar reserva PENDENTE_RETIRADA
      await this.httpService.decrementarEstoque(livroId);

      const dataLimite = new Date();
      dataLimite.setHours(dataLimite.getHours() + 24);

      const nova = new Reserva(
        String(livroId),
        String(alunoId),
        ReservaStatus.PENDENTE_RETIRADA,
        null,
      );
      nova.dataLimiteRetirada = dataLimite;
      this.reservas.push(nova);
      return nova;
    }

    // sem estoque: colocar na fila
    const ultimaPos = this.reservas
      .filter(
        (r) =>
          r.livroId === String(livroId) && r.status === ReservaStatus.NA_FILA,
      )
      .reduce((max, r) => Math.max(max, r.posicaoFila || 0), 0);

    console.log(
      `criarReserva: qt=${qt} <= 0 -> criando NA_FILA pos=${ultimaPos + 1}`,
    );
    const nova = new Reserva(
      String(livroId),
      String(alunoId),
      ReservaStatus.NA_FILA,
      ultimaPos + 1,
    );
    this.reservas.push(nova);
    return nova;
  }

  // Debug helper to list in-memory reservas
  listarReservasDebug() {
    return this.reservas;
  }

  // Debug: consulta o backend para obter dados do livro
  async buscarLivroBackend(livroId: number) {
    try {
      const r = await this.httpService.getLivro(livroId);
      return r.data;
    } catch (err: unknown) {
      const msg = String(err instanceof Error ? err.message : err);
      console.error('Erro ao buscar livro no backend:', msg);
      return null;
    }
  }

  async retirarReserva(reservaId: string) {
    const reserva = this.reservas.find((r) => r.id === reservaId);
    if (!reserva) throw new NotFoundException('Reserva não encontrada');

    if (
      reserva.status !== ReservaStatus.PENDENTE_RETIRADA &&
      reserva.status !== ReservaStatus.DISPONIVEL_PARA_COLETA
    ) {
      throw new BadRequestException(
        'Reserva não está disponível para retirada.',
      );
    }

    if (reserva.dataLimiteRetirada && new Date() > reserva.dataLimiteRetirada) {
      reserva.status = ReservaStatus.EXPIRADA;
      // repor estoque caso tenha sido decrementado quando criou
      try {
        await this.httpService.incrementarEstoque(Number(reserva.livroId));
      } catch (err) {
        console.error('Erro ao repor estoque para reserva expirada:', err);
      }
      throw new BadRequestException(
        'Reserva expirada. Favor criar uma nova reserva.',
      );
    }

    // criar emprestimo
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

    reserva.status = ReservaStatus.RETIRADA;
    reserva.emprestimoId = String(saved.id);

    // if reserva was from fila (posicaoFila not null), call next in queue
    if (reserva.posicaoFila) {
      await this.chamarProximoDaFila(reserva.livroId);
    }

    return { reserva, emprestimo: saved };
  }

  // when a copy becomes available, notify next in queue or increment backend stock
  private async chamarProximoDaFila(livroIdStr: string): Promise<void> {
    const fila = this.reservas
      .filter(
        (r) => r.livroId === livroIdStr && r.status === ReservaStatus.NA_FILA,
      )
      .sort((a, b) => (a.posicaoFila || 0) - (b.posicaoFila || 0));

    const proxima = fila[0];
    if (proxima) {
      const dataLimite = new Date();
      dataLimite.setHours(dataLimite.getHours() + 24);
      proxima.status = ReservaStatus.DISPONIVEL_PARA_COLETA;
      proxima.dataLimiteRetirada = dataLimite;
      // notificar usuário (integrar com notification service se houver)
      console.log(
        `Notificando ${proxima.alunoId} sobre livro ${livroIdStr}. Prazo: ${dataLimite.toISOString()}`,
      );
    } else {
      // sem reservas na fila, repor estoque no backend
      try {
        await this.httpService.incrementarEstoque(Number(livroIdStr));
      } catch (err) {
        console.error(
          'Erro ao incrementar estoque no backend ao liberar cópia:',
          err,
        );
      }
    }
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

    // chamar próximo da fila
    try {
      await this.chamarProximoDaFila(String(emprestimo.id_livro));
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
