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

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Verificar se reserva está em status válido para retirada
    if (reserva.status !== ReservaStatus.PENDENTE) {
      throw new BadRequestException(
        `Reserva não está disponível para retirada. Status atual: ${reserva.status}`,
      );
    }

    // Verificar se a reserva tem prazo de retirada (livro estava disponível)
    if (reserva.dataLimiteRetirada) {
      const agora = new Date();

      // Se expirou, marcar como expirada e liberar estoque
      if (agora > reserva.dataLimiteRetirada) {
        console.log(
          `[RESERVA] Tentativa de retirada de reserva expirada: ${reservaId}`,
        );

        reserva.status = ReservaStatus.EXPIRADA;
        reserva.updatedAt = new Date();
        await this.reservaRepo.save(reserva);

        // Incrementar estoque e chamar próximo
        await this.http.incrementarEstoque(Number(reserva.livroId));
        await this.chamarProximo(Number(reserva.livroId));

        throw new BadRequestException(
          'Reserva expirada. O livro foi liberado e você pode fazer uma nova reserva.',
        );
      }
    } else if (reserva.posicaoFila) {
      // Reserva ainda está na fila (livro estava indisponível)
      throw new BadRequestException(
        `Você está na posição ${reserva.posicaoFila} da fila. Aguarde ser notificado quando o livro estiver disponível.`,
      );
    }

    // Tudo OK, marcar como atendida
    console.log(
      `[RESERVA] Reserva ${reservaId} sendo retirada pelo usuário ${reserva.alunoId}`,
    );

    reserva.status = ReservaStatus.ATENDIDA;
    reserva.updatedAt = new Date();
    await this.reservaRepo.save(reserva);

    return reserva;
  }

  async chamarProximo(livroId: number) {
    // Buscar próximo da fila (apenas reservas com posicaoFila definida)
    const proximo = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.PENDENTE })
      .andWhere('r.posicaoFila IS NOT NULL') // Apenas reservas em fila
      .orderBy('r.posicaoFila', 'ASC')
      .getOne();

    // Se não houver ninguém na fila, incrementa estoque e retorna
    if (!proximo) {
      await this.http.incrementarEstoque(livroId);
      console.log(
        `[RESERVA] Nenhum usuário na fila para o livro ${livroId}. Estoque incrementado.`,
      );
      return;
    }

    console.log(
      `[RESERVA] Chamando próximo da fila: Reserva ${proximo.id} | Usuário ${proximo.alunoId} | Posição ${proximo.posicaoFila}`,
    );

    // Decrementar estoque (livro agora está reservado para o próximo da fila)
    await this.http.decrementarEstoque(livroId);

    // Atualizar reserva: adicionar prazo de 24h e remover da fila
    const limite = new Date();
    limite.setHours(limite.getHours() + 24);
    proximo.dataLimiteRetirada = limite;
    proximo.posicaoFila = null; // Remove da fila, agora tem reserva com prazo
    proximo.updatedAt = new Date();
    await this.reservaRepo.save(proximo);

    console.log(
      `[RESERVA] Próximo da fila notificado. Prazo até: ${limite.toISOString()}`,
    );

    // Publicar evento de reserva disponível
    await this.publicarEventoReservaDisponivel(proximo, livroId);

    return proximo;
  }

  async listarTodas() {
    return this.reservaRepo.find({ order: { dataReserva: 'DESC' } });
  }

  async listarPorUsuario(usuarioId: number) {
    return this.reservaRepo.find({
      where: { alunoId: String(usuarioId) },
      order: { dataReserva: 'DESC' },
    });
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

  async cancelarReserva(livroId: number, usuarioId: number) {
    // Buscar reserva PENDENTE do usuário para este livro
    const reserva = await this.reservaRepo.findOne({
      where: {
        livroId: String(livroId),
        alunoId: String(usuarioId),
        status: ReservaStatus.PENDENTE,
      },
    });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva não encontrada ou já foi cancelada/atendida',
      );
    }

    console.log(
      `[RESERVA] Cancelando reserva ${reserva.id} | Usuário: ${usuarioId} | Livro: ${livroId}`,
    );

    // Marcar como CANCELADA
    reserva.status = ReservaStatus.CANCELADA;
    reserva.updatedAt = new Date();
    await this.reservaRepo.save(reserva);

    // Se a reserva tinha prazo de retirada (estava disponível), incrementar estoque e chamar próximo
    if (reserva.dataLimiteRetirada) {
      await this.http.incrementarEstoque(livroId);
      console.log(
        `[RESERVA] Estoque do livro ${livroId} incrementado após cancelamento`,
      );

      // Chamar próximo da fila
      await this.chamarProximo(livroId);
    } else if (reserva.posicaoFila) {
      // Se estava na fila, remover da tabela de fila
      await this.reservaFilaRepo.delete({
        livroId: String(livroId),
        alunoId: String(usuarioId),
      });

      // Atualizar posições dos que estão atrás na fila
      const filaRestante = await this.reservaRepo
        .createQueryBuilder('r')
        .where('r.livroId = :livroId', { livroId: String(livroId) })
        .andWhere('r.status = :status', { status: ReservaStatus.PENDENTE })
        .andWhere('r.posicaoFila > :posicao', { posicao: reserva.posicaoFila })
        .andWhere('r.posicaoFila IS NOT NULL')
        .getMany();

      for (const r of filaRestante) {
        if (r.posicaoFila) {
          r.posicaoFila -= 1;
          await this.reservaRepo.save(r);
        }
      }

      console.log(
        `[RESERVA] Posições da fila atualizadas para o livro ${livroId}`,
      );
    }

    return {
      message: 'Reserva cancelada com sucesso',
      reserva: {
        id: reserva.id,
        status: reserva.status,
        livroId: reserva.livroId,
        usuarioId: reserva.alunoId,
      },
    };
  }
}
