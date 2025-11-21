import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Em produção, especificar domínios permitidos
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private usuariosConectados = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remover usuário do mapa
    for (const [userId, socketId] of this.usuariosConectados.entries()) {
      if (socketId === client.id) {
        this.usuariosConectados.delete(userId);
        this.logger.log(`Usuário ${userId} desconectado`);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    this.usuariosConectados.set(userId, client.id);
    this.logger.log(`Usuário ${userId} registrado com socket ${client.id}`);
    return { status: 'registered', userId };
  }

  enviarNotificacao(userId: string, notificacao: any) {
    const socketId = this.usuariosConectados.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notificacao', notificacao);
      this.logger.log(`Notificação enviada para usuário ${userId}`);
      return true;
    }
    this.logger.warn(`Usuário ${userId} não está conectado`);
    return false;
  }

  verificarUsuarioOnline(userId: string): boolean {
    return this.usuariosConectados.has(userId);
  }

  getUsuariosOnline(): string[] {
    return Array.from(this.usuariosConectados.keys());
  }
}
