import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacao } from '../entitys/notificacao.entity';
import { NotificacaoFila } from '../entitys/notificacaoFila.entity';
import { NotificationGateway } from './notification.gateway';

interface EventoNotificacaoDTO {
  userId: string;
  title: string;
  body: string;
  payload: Record<string, any>;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepo: Repository<Notificacao>,
    @InjectRepository(NotificacaoFila)
    private readonly filaRepo: Repository<NotificacaoFila>,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly gateway: NotificationGateway,
  ) {}

  async processarEvento(dto: EventoNotificacaoDTO): Promise<void> {
    const notificacao = this.notificacaoRepo.create({
      userId: dto.userId,
      titulo: dto.title,
      mensagem: dto.body,
      payload: dto.payload,
      enviada: false,
      lida: false,
    });
    await this.notificacaoRepo.save(notificacao);
    await this.enviarParaApp(dto.userId, notificacao);
  }

  async enviarParaApp(
    usuarioId: string,
    notificacao: Notificacao,
  ): Promise<void> {
    const online = this.gateway.verificarUsuarioOnline(usuarioId);
    if (online) {
      // Enviar via WebSocket
      const enviado = this.gateway.enviarNotificacao(usuarioId, {
        id: notificacao.id,
        titulo: notificacao.titulo,
        mensagem: notificacao.mensagem,
        payload: notificacao.payload,
        createdAt: notificacao.createdAt,
      });

      if (enviado) {
        notificacao.enviada = true;
        await this.notificacaoRepo.save(notificacao);
        console.log(`✅ [WS] Notificação enviada para usuário ${usuarioId}`);
      }
    } else {
      const fila = this.filaRepo.create({
        userId: usuarioId,
        notificacaoId: notificacao.id,
        notificacao,
      });
      await this.filaRepo.save(fila);
      console.log(
        `🕒 [FILA] Usuário offline. Notificação ${notificacao.id} salva na fila.`,
      );
    }
  }

  async listarPorUsuario(userId: string): Promise<Notificacao[]> {
    return this.notificacaoRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async marcarComoLida(id: string): Promise<Notificacao | null> {
    const notif = await this.notificacaoRepo.findOne({ where: { id } });
    if (!notif) return null;
    notif.lida = true;
    await this.notificacaoRepo.save(notif);
    return notif;
  }
}
