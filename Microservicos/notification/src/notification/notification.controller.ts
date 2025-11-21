import {
  Controller,
  Get,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async listar(@Param('userId') userId: string) {
    return this.notificationService.listarPorUsuario(userId);
  }

  @Patch(':id/lida')
  async marcarLida(@Param('id') id: string) {
    const notif = await this.notificationService.marcarComoLida(id);
    if (!notif) throw new NotFoundException('Notificação não encontrada');
    return { sucesso: true, id: notif.id };
  }
}
