import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacao } from '../entitys/notificacao.entity';
import { Usuario } from '../entitys/usuario.entity';
import axios from 'axios';

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
export class NotificationPushService {
  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepo: Repository<Notificacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async sendEmprestimoCriadoNotification(
    payload: EmprestimoCriadoPayload,
  ): Promise<void> {
    try {
      const titulo = '📚 Empréstimo Criado';
      const mensagem = `Seu empréstimo do livro "${payload.livroTitulo}" foi criado com sucesso!`;

      // Sempre salva a notificação primeiro
      await this.salvarNotificacao(
        payload.userId,
        titulo,
        mensagem,
        payload as unknown as Record<string, unknown>,
      );

      // Tenta enviar push se houver token
      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.userId },
      });

      if (usuario?.expoToken) {
        await this.enviarPushNotification(
          usuario.expoToken,
          titulo,
          mensagem,
          payload as unknown as Record<string, unknown>,
        );
        console.log(
          `✅ [PUSH] Notificação de empréstimo criado enviada para usuário ${payload.userId}`,
        );
      } else {
        console.log(
          `📝 [NOTIF] Notificação salva para usuário ${payload.userId} (sem token Expo)`,
        );
      }
    } catch (error) {
      console.error(
        '❌ [PUSH] Erro ao enviar notificação emprestimo.criado:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async sendLivroDevolvidoNotification(
    payload: LivroDevolvidoPayload,
  ): Promise<void> {
    try {
      const titulo = '✅ Livro Devolvido';
      const mensagem = `O livro "${payload.livroTitulo}" foi devolvido com sucesso. Obrigado!`;

      // Sempre salva a notificação primeiro
      await this.salvarNotificacao(
        payload.userId,
        titulo,
        mensagem,
        payload as unknown as Record<string, unknown>,
      );

      // Tenta enviar push se houver token
      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.userId },
      });

      if (usuario?.expoToken) {
        await this.enviarPushNotification(
          usuario.expoToken,
          titulo,
          mensagem,
          payload as unknown as Record<string, unknown>,
        );
        console.log(
          `✅ [PUSH] Notificação de livro devolvido enviada para usuário ${payload.userId}`,
        );
      } else {
        console.log(
          `📝 [NOTIF] Notificação salva para usuário ${payload.userId} (sem token Expo)`,
        );
      }
    } catch (error) {
      console.error(
        '❌ [PUSH] Erro ao enviar notificação livro.devolvido:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async sendReservaDisponivelNotification(
    payload: ReservaDisponivelPayload,
  ): Promise<void> {
    try {
      const titulo = '🎉 Reserva Disponível';
      const mensagem = `Seu livro "${payload.livroTitulo}" está disponível para retirada! Você tem 24h.`;

      // Sempre salva a notificação primeiro
      await this.salvarNotificacao(
        payload.userId,
        titulo,
        mensagem,
        payload as unknown as Record<string, unknown>,
      );

      // Tenta enviar push se houver token
      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.userId },
      });

      if (usuario?.expoToken) {
        await this.enviarPushNotification(
          usuario.expoToken,
          titulo,
          mensagem,
          payload as unknown as Record<string, unknown>,
        );
        console.log(
          `✅ [PUSH] Notificação de reserva disponível enviada para usuário ${payload.userId}`,
        );
      } else {
        console.log(
          `📝 [NOTIF] Notificação salva para usuário ${payload.userId} (sem token Expo)`,
        );
      }
    } catch (error) {
      console.error(
        '❌ [PUSH] Erro ao enviar notificação reserva.disponivel:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async salvarNotificacao(
    userId: string,
    titulo: string,
    mensagem: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const notificacao = this.notificacaoRepo.create({
      userId,
      titulo,
      mensagem,
      payload,
      enviada: false,
      lida: false,
    });
    await this.notificacaoRepo.save(notificacao);
  }

  private async enviarPushNotification(
    expoToken: string,
    titulo: string,
    mensagem: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const message = {
        to: expoToken,
        sound: 'default',
        title: titulo,
        body: mensagem,
        data,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const response = await axios.post(
        'https://exp.host/--/api/v2/push/send',
        message,
        { headers: { 'Content-Type': 'application/json' } },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data?.data?.[0]?.status === 'ok') {
        console.log(`✅ [EXPO] Push notification enviado para ${expoToken}`);
      } else {
        console.warn(
          `⚠️ [EXPO] Falha ao enviar push:`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          response.data?.data?.[0]?.message,
        );
      }
    } catch (error) {
      console.error(
        '❌ [EXPO] Erro ao enviar push notification:',
        error instanceof Error ? error.message : error,
      );
    }
  }
}
