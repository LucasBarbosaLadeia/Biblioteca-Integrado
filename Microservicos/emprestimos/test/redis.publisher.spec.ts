import { Test, TestingModule } from '@nestjs/testing';
import { RedisPublisher } from '../src/redis/redis.publisher';
import { Redis } from 'ioredis';

describe('RedisPublisher', () => {
  let publisher: RedisPublisher;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    mockRedis = {
      publish: jest.fn().mockResolvedValue(1),
    } as unknown as jest.Mocked<Redis>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisPublisher,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    publisher = module.get<RedisPublisher>(RedisPublisher);
  });

  describe('publicarEmprestimoCriado', () => {
    it('should publish emprestimo.criado event', async () => {
      const payload = {
        userId: '123',
        livroId: '456',
        livroTitulo: 'Test Book',
        emprestimoId: '789',
        data: new Date().toISOString(),
      };

      await publisher.publicarEmprestimoCriado(payload);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'emprestimo.criado',
        JSON.stringify(payload),
      );
    });

    it('should handle errors gracefully', async () => {
      mockRedis.publish.mockRejectedValueOnce(new Error('Redis error'));

      const payload = {
        userId: '123',
        livroId: '456',
        livroTitulo: 'Test Book',
        emprestimoId: '789',
        data: new Date().toISOString(),
      };

      await expect(
        publisher.publicarEmprestimoCriado(payload),
      ).resolves.not.toThrow();
    });
  });

  describe('publicarLivroDevolvido', () => {
    it('should publish livro.devolvido event', async () => {
      const payload = {
        userId: '123',
        livroId: '456',
        livroTitulo: 'Test Book',
        emprestimoId: '789',
        data: new Date().toISOString(),
      };

      await publisher.publicarLivroDevolvido(payload);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'livro.devolvido',
        JSON.stringify(payload),
      );
    });
  });

  describe('publicarReservaDisponivel', () => {
    it('should publish reserva.disponivel event', async () => {
      const payload = {
        userId: '123',
        livroId: '456',
        livroTitulo: 'Test Book',
        reservaId: '789',
        data: new Date().toISOString(),
      };

      await publisher.publicarReservaDisponivel(payload);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'reserva.disponivel',
        JSON.stringify(payload),
      );
    });
  });
});
