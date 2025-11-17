import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [AppController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
