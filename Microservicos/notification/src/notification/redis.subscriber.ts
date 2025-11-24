import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import { FilaService } from './fila.service';
import { EventoTipo } from '../entitys/eventoFila.entity';

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
  tempoExpirado: number;
}

@Injectable()
export class RedisSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisSubscriber.name);
  private subscriber: Redis;
  private readonly channels = [
    'emprestimo.criado',
    'livro.devolvido',
    'reserva.disponivel',
    'reserva.expirada',
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly filaService: FilaService,
  ) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'redis';
    const port = Number(this.configService.get('REDIS_PORT')) || 6379;

    this.subscriber = new IORedis({ host, port });

    this.logger.log(`🔌 Conectado ao Redis: ${host}:${port}`);

    this.subscriber.on('message', (channel, message) => {
      this.logger.log(`📨 Evento recebido no canal: ${channel}`);
      void this.handleMessage(channel, message);
    });

    this.subscriber.on('error', (error) => {
      this.logger.error(`❌ Erro no Redis Subscriber: ${error.message}`);
    });

    for (const channel of this.channels) {
      await this.subscriber.subscribe(channel);
    }

    this.logger.log(`👂 Escutando canais: ${this.channels.join(', ')}`);
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
    this.logger.log('🔌 Desconectado do Redis');
  }

  private async handleMessage(channel: string, raw: string): Promise<void> {
    try {
      const data = JSON.parse(raw) as Record<string, unknown>;

      let tipoEvento: EventoTipo;

      switch (channel) {
        case 'emprestimo.criado':
          tipoEvento = EventoTipo.EMPRESTIMO_CRIADO;
          break;

        case 'livro.devolvido':
          tipoEvento = EventoTipo.LIVRO_DEVOLVIDO;
          break;

        case 'reserva.disponivel':
          tipoEvento = EventoTipo.RESERVA_DISPONIVEL;
          break;

        case 'reserva.expirada':
          tipoEvento = EventoTipo.RESERVA_EXPIRADA;
          break;

        default:
          this.logger.warn(`⚠️ Canal desconhecido: ${channel}`);
          return;
      }

      // Adicionar evento à fila persistente
      await this.filaService.adicionarEvento(tipoEvento, data);
      this.logger.log(
        `✅ Evento ${channel} adicionado à fila para processamento`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Erro ao processar mensagem do canal ${channel}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
