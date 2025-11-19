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

@Injectable()
export class ReservasService {
  constructor(
    private readonly http: HttpServiceMicro,
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Emprestimo)
    private readonly emprestimoRepo: Repository<Emprestimo>,
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
          id_usuario: Number(usuarioId),
          id_livro: Number(livroId),
          status: 'ativo',
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
      where: {
        livroId: String(livroId),
        alunoId: String(usuarioId),
        status: In([
          ReservaStatus.NA_FILA,
          ReservaStatus.DISPONIVEL_PARA_COLETA,
          ReservaStatus.PENDENTE_RETIRADA,
        ]),
      },
    });

    if (jaReservou) {
      throw new BadRequestException(
        'Usuário já possui uma reserva para este livro',
      );
    }

    if (qt > 0) {
      await this.http.decrementarEstoque(livroId);

      const dataLimite = new Date();
      dataLimite.setHours(dataLimite.getHours() + 24);

      const reserva = this.reservaRepo.create({
        livroId: String(livroId),
        alunoId: String(usuarioId),
        status: ReservaStatus.PENDENTE_RETIRADA,
        dataLimiteRetirada: dataLimite,
        posicaoFila: null,
        emprestimoId: null,
      });

      await this.reservaRepo.save(reserva);
      return reserva;
    }

    const last = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.NA_FILA })
      .orderBy('r.posicaoFila', 'DESC')
      .getOne();

    const posicao = (last?.posicaoFila ?? 0) + 1;

    const reserva = this.reservaRepo.create({
      livroId: String(livroId),
      alunoId: String(usuarioId),
      status: ReservaStatus.NA_FILA,
      posicaoFila: posicao,
      dataLimiteRetirada: null,
      emprestimoId: null,
    });

    await this.reservaRepo.save(reserva);
    return reserva;
  }

  private getQtAtualFromLivroResponse(resp: unknown): number {
    if (!resp) return 0;
    const asObj = resp as Record<string, unknown>;

    // Common shapes: { data: { qt_atual: 1 } } or { qt_atual: 1 }
    const dataProp = asObj['data'];
    if (dataProp && typeof dataProp === 'object') {
      const direct = dataProp as Record<string, unknown>;
      if (Object.prototype.hasOwnProperty.call(direct, 'qt_atual')) {
        const raw = direct['qt_atual'];
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
          const parsed = Number(raw);
          return Number.isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      }
      const inner = direct['data'];
      if (
        inner &&
        typeof inner === 'object' &&
        Object.prototype.hasOwnProperty.call(inner, 'qt_atual')
      ) {
        const raw = (inner as Record<string, unknown>)['qt_atual'];
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
          const parsed = Number(raw);
          return Number.isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      }
    }

    if (
      typeof asObj === 'object' &&
      Object.prototype.hasOwnProperty.call(asObj, 'qt_atual')
    ) {
      const raw = (asObj as Record<string, unknown>)['qt_atual'];
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    }

    // Fallback: shallow recursive search (depth-limited)
    const seen = new Set<object>();
    function find(obj: unknown, depth = 0): number | null {
      if (!obj || typeof obj !== 'object' || depth > 4) return null;
      const o = obj as Record<string, unknown>;
      if (seen.has(o)) return null;
      seen.add(o);
      if (Object.prototype.hasOwnProperty.call(o, 'qt_atual')) {
        const raw = o['qt_atual'];
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
          const parsed = Number(raw);
          return Number.isNaN(parsed) ? null : parsed;
        }
        return null;
      }
      for (const k of Object.keys(o)) {
        const res = find(o[k], depth + 1);
        if (res !== null) return res;
      }
      return null;
    }

    const found = find(asObj, 0);
    return found ?? 0;
  }

  async retirarReserva(reservaId: string) {
    const reserva = await this.reservaRepo.findOne({
      where: { id: reservaId },
    });
    if (!reserva) throw new NotFoundException('Reserva não encontrada');

    if (
      ![
        ReservaStatus.PENDENTE_RETIRADA,
        ReservaStatus.DISPONIVEL_PARA_COLETA,
      ].includes(reserva.status)
    ) {
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

    reserva.status = ReservaStatus.RETIRADA;
    await this.reservaRepo.save(reserva);
    return reserva;
  }

  async chamarProximo(livroId: number) {
    const proximo = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.NA_FILA })
      .orderBy('r.posicaoFila', 'ASC')
      .getOne();

    if (!proximo) {
      await this.http.incrementarEstoque(livroId);
      return;
    }

    proximo.status = ReservaStatus.DISPONIVEL_PARA_COLETA;
    const limite = new Date();
    limite.setHours(limite.getHours() + 24);
    proximo.dataLimiteRetirada = limite;
    await this.reservaRepo.save(proximo);
    console.log(` Notificando usuário ${proximo.alunoId}  livro disponível!`);
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
}
