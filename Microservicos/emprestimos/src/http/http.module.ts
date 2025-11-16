import { Module } from '@nestjs/common';
import { HttpServiceMicro } from './http.service';

@Module({
  providers: [HttpServiceMicro],
  exports: [HttpServiceMicro],
})
export class HttpModule {}
