import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

interface EmprestimoCriadoPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  emprestimoId: string;
  data: string;
}

interface LivroDevolvidoPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  emprestimoId: string;
  data: string;
}

interface ReservaDisponivelPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  reservaId: string;
  data: string;
}

interface ReservaExpiradaPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  reservaId: string;
  data: string;
  tempoExpirado: number; // em minutos
}

@Injectable()
export class RedisPublisher {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async publicarEmprestimoCriado(
    payload: EmprestimoCriadoPayload,
  ): Promise<void> {
    try {
      await this.redis.publish('emprestimo.criado', JSON.stringify(payload));
      console.log(
        `📨 [PUBLISHER] Evento 'emprestimo.criado' publicado para usuário ${payload.userId}`,
      );
    } catch (error) {
      console.error(
        '❌ [PUBLISHER] Erro ao publicar emprestimo.criado:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async publicarLivroDevolvido(payload: LivroDevolvidoPayload): Promise<void> {
    try {
      await this.redis.publish('livro.devolvido', JSON.stringify(payload));
      console.log(
        `📨 [PUBLISHER] Evento 'livro.devolvido' publicado para usuário ${payload.userId}`,
      );
    } catch (error) {
      console.error(
        '❌ [PUBLISHER] Erro ao publicar livro.devolvido:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async publicarReservaDisponivel(
    payload: ReservaDisponivelPayload,
  ): Promise<void> {
    try {
      await this.redis.publish('reserva.disponivel', JSON.stringify(payload));
      console.log(
        `📨 [PUBLISHER] Evento 'reserva.disponivel' publicado para usuário ${payload.userId}`,
      );
    } catch (error) {
      console.error(
        '❌ [PUBLISHER] Erro ao publicar reserva.disponivel:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async publicarReservaExpirada(
    payload: ReservaExpiradaPayload,
  ): Promise<void> {
    try {
      await this.redis.publish('reserva.expirada', JSON.stringify(payload));
      console.log(
        `📨 [PUBLISHER] Evento 'reserva.expirada' publicado para usuário ${payload.userId} | Livro: ${payload.livroTitulo}`,
      );
    } catch (error) {
      console.error(
        '❌ [PUBLISHER] Erro ao publicar reserva.expirada:',
        error instanceof Error ? error.message : error,
      );
    }
  }
}
