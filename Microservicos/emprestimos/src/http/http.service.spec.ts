import { Test, TestingModule } from '@nestjs/testing';
import { HttpServiceMicro } from './http.service';

describe('HttpServiceMicro', () => {
  let service: HttpServiceMicro;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpServiceMicro],
    }).compile();

    service = module.get<HttpServiceMicro>(HttpServiceMicro);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
