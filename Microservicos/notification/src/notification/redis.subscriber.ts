import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import { NotificationPushService } from './notification-push.service';

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

@Injectable()
export class RedisSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscriber: Redis;
  private readonly channels = [
    'emprestimo.criado',
    'livro.devolvido',
    'reserva.disponivel',
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly pushService: NotificationPushService,
  ) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'redis';
    const port = Number(this.configService.get('REDIS_PORT')) || 6379;

    this.subscriber = new IORedis({ host, port });

    console.log(`🔌 [REDIS SUBSCRIBER] Conectado ao Redis: ${host}:${port}`);

    this.subscriber.on('message', (channel, message) => {
      console.log(`📨 [SUBSCRIBER] Evento recebido no canal: ${channel}`);
      void this.handleMessage(channel, message);
    });

    for (const channel of this.channels) {
      await this.subscriber.subscribe(channel);
    }

    console.log(
      `👂 [REDIS SUBSCRIBER] Escutando canais: ${this.channels.join(', ')}`,
    );
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
    console.log('🔌 [REDIS SUBSCRIBER] Desconectado');
  }

  private async handleMessage(channel: string, raw: string): Promise<void> {
    try {
      const data = JSON.parse(raw) as Record<string, unknown>;

      switch (channel) {
        case 'emprestimo.criado':
          await this.pushService.sendEmprestimoCriadoNotification(
            data as unknown as EmprestimoCriadoPayload,
          );
          break;

        case 'livro.devolvido':
          await this.pushService.sendLivroDevolvidoNotification(
            data as unknown as LivroDevolvidoPayload,
          );
          break;

        case 'reserva.disponivel':
          await this.pushService.sendReservaDisponivelNotification(
            data as unknown as ReservaDisponivelPayload,
          );
          break;

        default:
          console.warn(`⚠️ [SUBSCRIBER] Canal desconhecido: ${channel}`);
      }
    } catch (error) {
      console.error(
        `❌ [SUBSCRIBER] Erro ao processar mensagem do canal ${channel}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
