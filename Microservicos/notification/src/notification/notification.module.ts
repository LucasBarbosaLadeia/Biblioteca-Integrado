import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationsWorker } from './notifications.worker';
import { NotificationGateway } from './notification.gateway';
import { Notificacao } from '../entitys/notificacao.entity';
import { NotificacaoFila } from '../entitys/notificacaoFila.entity';
import { Usuario } from '../entitys/usuario.entity';
import { RedisSubscriber } from './redis.subscriber';
import { NotificationPushService } from './notification-push.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notificacao, NotificacaoFila, Usuario]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationsWorker,
    NotificationGateway,
    RedisSubscriber,
    NotificationPushService,
  ],
})
export class NotificationModule {}
