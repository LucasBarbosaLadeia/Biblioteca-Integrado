import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationsWorker } from './notifications.worker';
import { NotificationGateway } from './notification.gateway';
import { Notificacao } from '../entitys/notificacao.entity';
import { NotificacaoFila } from '../entitys/notificacaoFila.entity';
import { Usuario } from '../entitys/usuario.entity';
import { EventoFila } from '../entitys/eventoFila.entity';
import { RedisSubscriber } from './redis.subscriber';
import { NotificationPushService } from './notification-push.service';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Notificacao,
      NotificacaoFila,
      Usuario,
      EventoFila,
    ]),
  ],
  controllers: [NotificationController, FilaController],
  providers: [
    NotificationService,
    NotificationsWorker,
    NotificationGateway,
    RedisSubscriber,
    NotificationPushService,
    FilaService,
  ],
})
export class NotificationModule {}
