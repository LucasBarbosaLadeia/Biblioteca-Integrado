import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpServiceMicro } from '../http/http.service';
import { Reserva, ReservaStatus } from './reserva.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Emprestimo } from '../emprestimos/Emprestimo.entity';
import { ReservaFila } from './reserva_fila.entity';
import { RedisPublisher } from '../redis/redis.publisher';

@Injectable()
export class ReservasService {
  constructor(
    private readonly http: HttpServiceMicro,
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Emprestimo)
    private readonly emprestimoRepo: Repository<Emprestimo>,
    @InjectRepository(ReservaFila)
    private readonly reservaFilaRepo: Repository<ReservaFila>,
    private readonly redisPublisher: RedisPublisher,
  ) {}

  async criarReserva(livroId: number, usuarioId: number) {
    await this.http.getUsuario(usuarioId).catch(() => {
      throw new NotFoundException('Usuário não encontrado');
    });

    const livro = await this.http.getLivro(livroId).catch(() => {
      throw new NotFoundException('Livro não encontrado');
    });

    const qt = this.getQtAtualFromLivroResponse(livro);

    // Não permitir que usuário reserve um livro que ele já possui em empréstimo ativo
    try {
      const emprestimoAtivo = await this.emprestimoRepo.findOne({
        where: {
          idUsuario: Number(usuarioId),
          idLivro: Number(livroId),
          status: 'ATIVO',
        },
      });
      if (emprestimoAtivo) {
        throw new BadRequestException(
          'Usuário já possui um empréstimo ativo para este livro',
        );
      }
    } catch (err) {
      // rethrow BadRequestException, otherwise ignore DB errors and proceed
      if (err instanceof BadRequestException) throw err;
    }

    const jaReservou = await this.reservaRepo.findOne({
      where: [
        {
          livroId: String(livroId),
          alunoId: String(usuarioId),
          status: ReservaStatus.PENDENTE,
        },
      ],
    });

    if (jaReservou) {
      throw new BadRequestException(
        'Usuário já possui uma reserva para este livro',
      );
    }

    if (qt > 0) {
      await this.http.decrementarEstoque(livroId);

      const agora = new Date();
      const dataLimite = new Date();
      dataLimite.setHours(dataLimite.getHours() + 24);

      const reserva = this.reservaRepo.create({
        livroId: String(livroId),
        alunoId: String(usuarioId),
        status: ReservaStatus.PENDENTE,
        dataReserva: agora,
        dataLimiteRetirada: dataLimite,
        posicaoFila: null,
        emprestimoId: null,
      });

      await this.reservaRepo.save(reserva);

      // Publicar evento de reserva criada no Redis
      const livroData = (livro.data as any)?.data || livro.data;
      await this.redisPublisher.publicarReservaDisponivel({
        reservaId: reserva.id,
        userId: String(usuarioId),
        livroId: String(livroId),
        livroTitulo: livroData?.titulo || 'Livro',
        data: new Date().toISOString(),
      });

      return reserva;
    }

    const last = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.PENDENTE })
      .orderBy('r.posicaoFila', 'DESC')
      .getOne();

    const posicao = (last?.posicaoFila ?? 0) + 1;

    const agora = new Date();
    const reserva = this.reservaRepo.create({
      livroId: String(livroId),
      alunoId: String(usuarioId),
      status: ReservaStatus.PENDENTE,
      dataReserva: agora,
      posicaoFila: posicao,
      dataLimiteRetirada: null,
      emprestimoId: null,
    });

    await this.reservaRepo.save(reserva);

    // persistir na tabela de fila
    const filaEntry = this.reservaFilaRepo.create({
      livroId: String(livroId),
      alunoId: String(usuarioId),
      posicao: posicao,
    });
    await this.reservaFilaRepo.save(filaEntry);

    // Publicar evento de reserva na fila no Redis
    const livroData = (livro.data as any)?.data || livro.data;
    await this.redisPublisher.publicarReservaDisponivel({
      reservaId: reserva.id,
      userId: String(usuarioId),
      livroId: String(livroId),
      livroTitulo: livroData?.titulo || 'Livro',
      data: new Date().toISOString(),
    });

    return reserva;
  }

  private getQtAtualFromLivroResponse(resp: unknown): number {
    if (!resp) return 0;

    const asObj = resp as Record<string, unknown>;

    // Helper para converter qualquer valor em número
    const toNumber = (value: unknown): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    const dataProp = asObj['data'];
    if (dataProp && typeof dataProp === 'object') {
      const direct = dataProp as Record<string, unknown>;

      if ('qt_atual' in direct) return toNumber(direct['qt_atual']);

      const inner = direct['data'];
      if (inner && typeof inner === 'object' && 'qt_atual' in (inner as any)) {
        return toNumber((inner as Record<string, unknown>)['qt_atual']);
      }
    }

    if ('qt_atual' in asObj) {
      return toNumber(asObj['qt_atual']);
    }

    const seen = new Set<object>();

    function search(obj: unknown, depth = 0): number | null {
      if (!obj || typeof obj !== 'object' || depth > 4) return null;

      const current = obj as Record<string, unknown>;
      if (seen.has(current)) return null;
      seen.add(current);

      if ('qt_atual' in current) {
        return toNumber(current['qt_atual']);
      }

      for (const key of Object.keys(current)) {
        const value = current[key];
        const result = search(value, depth + 1);
        if (result !== null) return result;
      }

      return null;
    }

    return search(asObj, 0) ?? 0;
  }

  async retirarReserva(reservaId: string) {
    const reserva = await this.reservaRepo.findOne({
      where: { id: reservaId },
    });
    if (!reserva) throw new NotFoundException('Reserva não encontrada');

    if (reserva.status !== ReservaStatus.PENDENTE) {
      throw new BadRequestException(
        'Reserva não está disponível para retirada.',
      );
    }

    if (reserva.dataLimiteRetirada && new Date() > reserva.dataLimiteRetirada) {
      reserva.status = ReservaStatus.EXPIRADA;
      await this.reservaRepo.save(reserva);
      await this.http.incrementarEstoque(Number(reserva.livroId));
      throw new BadRequestException('Reserva expirada. Faça uma nova reserva.');
    }

    reserva.status = ReservaStatus.ATENDIDA;
    await this.reservaRepo.save(reserva);
    return reserva;
  }

  async chamarProximo(livroId: number) {
    const proximo = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.PENDENTE })
      .orderBy('r.posicaoFila', 'ASC')
      .getOne();

    if (!proximo) {
      await this.http.incrementarEstoque(livroId);
      return;
    }

    proximo.status = ReservaStatus.PENDENTE;
    const limite = new Date();
    limite.setHours(limite.getHours() + 24);
    proximo.dataLimiteRetirada = limite;
    await this.reservaRepo.save(proximo);

    // Publicar evento de reserva disponível
    await this.publicarEventoReservaDisponivel(proximo, livroId);

    return proximo;
  }

  async listarTodas() {
    return this.reservaRepo.find({ order: { dataReserva: 'DESC' } });
  }

  async buscarLivroBackend(livroId: number) {
    try {
      const r = await this.http.getLivro(livroId);
      return r.data;
    } catch (err: unknown) {
      const msg = String(err instanceof Error ? err.message : err);
      console.error('Erro ao buscar livro no backend:', msg);
      return null;
    }
  }

  private async publicarEventoReservaDisponivel(
    reserva: Reserva,
    livroId: number,
  ): Promise<void> {
    try {
      const livroResponse = await this.http.getLivro(livroId).catch(() => null);
      const livroData = livroResponse?.data as { titulo?: string } | undefined;
      const livroTitulo = (livroData?.titulo as string) || `Livro #${livroId}`;

      await this.redisPublisher.publicarReservaDisponivel({
        userId: String(reserva.alunoId),
        livroId: String(livroId),
        livroTitulo: livroTitulo,
        reservaId: String(reserva.id),
        data: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        '❌ [RESERVA] Erro ao publicar evento reserva.disponivel:',
        error,
      );
    }
  }
}
