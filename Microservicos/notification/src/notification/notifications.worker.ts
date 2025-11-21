import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationService } from './notification.service';

interface EventoNotificacaoDTO {
  userId: string;
  title: string;
  body: string;
  payload: Record<string, any>;
}

@Injectable()
export class NotificationsWorker implements OnModuleInit {
  private subscriber: Redis;
  private readonly channels = [
    'emprestimo.criado',
    'livro.devolvido',
    'reserva.notificada',
  ];

  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit() {
    void this.iniciar();
  }

  private iniciar(): void {
    const host = process.env.REDIS_HOST || 'redis';
    const port = parseInt(process.env.REDIS_PORT || '6379');

    this.subscriber = new Redis({ host, port });
    console.log(`🔌 [NOTIFICATIONS WORKER] Conectado ao Redis ${host}:${port}`);

    this.subscriber.on('message', (channel, message) => {
      console.log(
        `📨 [WORKER] Evento recebido canal=${channel} mensagem=${message}`,
      );
      this.tratarMensagem(channel, message);
    });

    this.channels.forEach((c) => this.subscriber.subscribe(c));
    console.log(
      `👂 [WORKER] Subscrito nos canais: ${this.channels.join(', ')}`,
    );
  }

  private tratarMensagem(channel: string, raw: string): void {
    let data: Record<string, unknown> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      console.warn('⚠️ [WORKER] Falha ao parsear JSON, usando texto cru.');
      data = { raw };
    }

    const userId =
      (data.userId as string) ||
      (data.usuarioId as string) ||
      (data.user_id as string) ||
      'desconhecido';

    const dto: EventoNotificacaoDTO = {
      userId,
      title: this.mapTitulo(channel),
      body: this.mapMensagem(channel, data),
      payload: { canal: channel, ...data },
    };

    // Processar evento de forma assíncrona sem bloquear
    setImmediate(() => {
      this.notificationService.processarEvento(dto).catch((error) => {
        console.error('Erro ao processar evento:', error);
      });
    });
  }

  private mapTitulo(channel: string): string {
    switch (channel) {
      case 'emprestimo.criado':
        return 'Empréstimo criado';
      case 'livro.devolvido':
        return 'Livro devolvido';
      case 'reserva.notificada':
        return 'Reserva disponível';
      default:
        return 'Atualização';
    }
  }

  private mapMensagem(channel: string, data: Record<string, unknown>): string {
    const livroTitulo =
      (data.livroTitulo as string) || (data.livro as string) || 'N/D';

    switch (channel) {
      case 'emprestimo.criado':
        return `Seu empréstimo foi registrado (livro: ${livroTitulo}).`;
      case 'livro.devolvido':
        return `Livro devolvido: ${livroTitulo}. Obrigado!`;
      case 'reserva.notificada':
        return `Reserva liberada para retirada: ${livroTitulo}.`;
      default:
        return 'Você possui uma nova notificação.';
    }
  }
}
