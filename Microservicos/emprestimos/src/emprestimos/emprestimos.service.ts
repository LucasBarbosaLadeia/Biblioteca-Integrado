import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Emprestimo } from './Emprestimo.entity';
import { CreateEmprestimoDto } from './dto/create-emprestimos.dto';
import { HttpServiceMicro } from '../http/http.service';
import { ReservaStatus } from '../reservas/reserva.entity';
import { ReservasService } from '../reservas/reservas.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { RedisPublisher } from '../redis/redis.publisher';

@Injectable()
export class EmprestimosService {
  private readonly logger = new Logger(EmprestimosService.name);

  constructor(
    @InjectRepository(Emprestimo)
    private readonly repo: Repository<Emprestimo>,
    private readonly httpService: HttpServiceMicro,
    private readonly reservasService: ReservasService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly redisPublisher: RedisPublisher,
  ) {
    this.logger.log('[CACHE] EmprestimosService inicializado com cache ativo');
  }

  async create(dto: CreateEmprestimoDto) {
    const { idUsuario, idLivro, dataPrevistaDevolucao } = dto;

    await this.httpService.getUsuario(idUsuario).catch(() => {
      throw new NotFoundException('Usuário não encontrado');
    });

    const livro = await this.httpService.getLivro(idLivro).catch(() => {
      throw new NotFoundException('Livro não encontrado');
    });

    const emprestimoAtivo = await this.repo.findOne({
      where: { idUsuario, idLivro, status: 'ATIVO' },
    });

    if (emprestimoAtivo) {
      throw new BadRequestException(
        'Empréstimo ativo já existe para este usuário e livro',
      );
    }

    // check local reservations for this user and book
    const todas = await this.reservasService.listarTodas();
    const reserva =
      todas.find(
        (r) =>
          r.livroId === String(idLivro) &&
          r.alunoId === String(idUsuario) &&
          r.status === ReservaStatus.PENDENTE,
      ) || null;

    if (!reserva && livro.data.qt_atual <= 0) {
      throw new BadRequestException('Livro não disponível para empréstimo.');
    }

    const hoje = new Date();
    const dataDev = new Date(dataPrevistaDevolucao);
    if (dataDev <= hoje) {
      throw new BadRequestException(
        'Data de devolução prevista deve ser futura',
      );
    }

    const novoEmprestimo = this.repo.create({
      idUsuario,
      idLivro,
      dataEmprestimo: new Date(),
      dataPrevistaDevolucao,
      status: 'ATIVO',
    });

    const savedEmprestimo = await this.repo.save(novoEmprestimo);

    if (reserva) {
      reserva.status = ReservaStatus.ATENDIDA;
      // Note: não decrementar estoque aqui pois já foi reservado quando criada
    } else {
      await this.httpService.decrementarEstoque(idLivro);
    }

    // Invalidar cache após criar empréstimo
    await this.invalidarCacheEmprestimos('criar empréstimo');

    // Publicar evento de empréstimo criado
    await this.publicarEventoEmprestimoCriado(savedEmprestimo, livro);

    return savedEmprestimo;
  }

  // Delegate reservation creation to ReservasService
  async criarReserva(livroId: number, alunoId: number) {
    return this.reservasService.criarReserva(livroId, alunoId);
  }

  // Debug helper to list in-memory reservas
  listarReservasDebug() {
    return this.reservasService.listarTodas();
  }

  // Debug: consulta o backend para obter dados do livro
  async buscarLivroBackend(livroId: number) {
    return this.reservasService.buscarLivroBackend(livroId);
  }

  async retirarReserva(reservaId: string) {
    // delegate reservation validation & status update to ReservasService
    const reserva = await this.reservasService.retirarReserva(reservaId);

    // criar emprestimo a partir da reserva validada
    const dataPrev = new Date();
    dataPrev.setDate(dataPrev.getDate() + 7);

    const novoEmp = this.repo.create({
      idUsuario: Number(reserva.alunoId),
      idLivro: Number(reserva.livroId),
      dataEmprestimo: new Date(),
      dataPrevistaDevolucao: dataPrev,
      status: 'ATIVO',
    });

    const saved = await this.repo.save(novoEmp);

    // link emprestimo na reserva (objeto retornado é a mesma referência em memória)
    reserva.emprestimoId = String(saved.id);

    // if reserva was from fila (posicaoFila not null), call next in queue
    if (reserva.posicaoFila) {
      await this.reservasService.chamarProximo(Number(reserva.livroId));
    }

    return { reserva, emprestimo: saved };
  }

  async findOne(id: number) {
    const cacheKey = `emprestimos:${id}`;
    const startTime = Date.now();

    // Tentar buscar do cache
    const cached = await this.cacheManager.get<Emprestimo>(cacheKey);
    if (cached) {
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ [CACHE HIT] Emprestimo ID ${id} | Tempo: ${duration}ms | Origem: Redis`,
      );
      return cached;
    }

    this.logger.log(
      `❌ [CACHE MISS] Emprestimo ID ${id} | Buscando no banco de dados...`,
    );
    const dbStartTime = Date.now();
    const emprestimo = await this.repo.findOne({ where: { id } });
    const dbDuration = Date.now() - dbStartTime;

    if (!emprestimo) throw new NotFoundException('Emprestimo not found');

    // Salvar no cache com TTL de 30 minutos (1800 segundos)
    await this.cacheManager.set(cacheKey, emprestimo, 1800000);
    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `💾 [CACHE SET] Emprestimo ID ${id} | TTL: 30min | Tempo DB: ${dbDuration}ms | Tempo Total: ${totalDuration}ms`,
    );

    return emprestimo;
  }

  async devolver(id: number) {
    const emprestimo = await this.repo.findOne({ where: { id } });
    if (!emprestimo) throw new NotFoundException('Emprestimo não encontrado');

    if (emprestimo.status !== 'ATIVO') {
      throw new BadRequestException('Empréstimo não está ativo');
    }

    emprestimo.dataDevolucao = new Date();
    emprestimo.status = 'DEVOLVIDO';

    const saved = await this.repo.save(emprestimo);

    // Invalidar cache após devolver
    await this.invalidarCacheEmprestimos('devolver empréstimo');
    await this.cacheManager.del(`emprestimos:${id}`);
    this.logger.warn(
      `🗑️ [CACHE INVALIDATE] Emprestimo ID ${id} removido do cache | Motivo: devolução`,
    );

    // Publicar evento de livro devolvido
    await this.publicarEventoLivroDevolvido(saved);

    // chamar próximo da fila via ReservasService
    try {
      await this.reservasService.chamarProximo(Number(emprestimo.idLivro));
    } catch (err) {
      console.error('Erro ao processar fila de reservas após devolução:', err);
    }

    return saved;
  }

  async findAll() {
    const cacheKey = 'emprestimos:all';
    const startTime = Date.now();

    // Tentar buscar do cache
    const cached = await this.cacheManager.get<Emprestimo[]>(cacheKey);
    if (cached) {
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ [CACHE HIT] Lista completa (${cached.length} emprestimos) | Tempo: ${duration}ms | Origem: Redis`,
      );
      return cached;
    }

    this.logger.log(
      `❌ [CACHE MISS] Lista de emprestimos | Buscando no banco de dados...`,
    );
    const dbStartTime = Date.now();
    const emprestimos = await this.repo.find();
    const dbDuration = Date.now() - dbStartTime;

    // Salvar no cache com TTL de 5 minutos (300 segundos)
    await this.cacheManager.set(cacheKey, emprestimos, 300000);
    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `💾 [CACHE SET] Lista (${emprestimos.length} emprestimos) | TTL: 5min | Tempo DB: ${dbDuration}ms | Tempo Total: ${totalDuration}ms`,
    );

    return emprestimos;
  }

  async findByUsuario(usuarioId: number) {
    const cacheKey = `emprestimos:usuario:${usuarioId}`;
    const startTime = Date.now();

    // Tentar buscar do cache
    const cached = await this.cacheManager.get<Emprestimo[]>(cacheKey);
    if (cached) {
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ [CACHE HIT] Emprestimos usuario ${usuarioId} (${cached.length} registros) | Tempo: ${duration}ms | Origem: Redis`,
      );
      return cached;
    }

    this.logger.log(
      `❌ [CACHE MISS] Emprestimos usuario ${usuarioId} | Buscando no banco de dados...`,
    );
    const dbStartTime = Date.now();
    const emprestimos = await this.repo.find({
      where: { idUsuario: usuarioId },
    });
    const dbDuration = Date.now() - dbStartTime;

    // Salvar no cache com TTL de 5 minutos (300 segundos)
    await this.cacheManager.set(cacheKey, emprestimos, 300000);
    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `💾 [CACHE SET] Emprestimos usuario ${usuarioId} (${emprestimos.length} registros) | TTL: 5min | Tempo DB: ${dbDuration}ms | Tempo Total: ${totalDuration}ms`,
    );

    return emprestimos;
  }

  async estatisticas() {
    const cacheKey = 'emprestimos:estatisticas';
    const startTime = Date.now();

    // Tentar buscar do cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ [CACHE HIT] Estatisticas | Tempo: ${duration}ms | Origem: Redis`,
      );
      return cached;
    }

    this.logger.log(
      `❌ [CACHE MISS] Estatisticas | Calculando 4 queries no banco...`,
    );
    const dbStartTime = Date.now();
    const total = await this.repo.count();
    const ativos = await this.repo.count({ where: { status: 'ATIVO' } });
    const devolvidos = await this.repo.count({
      where: { status: 'DEVOLVIDO' },
    });
    const atrasados = await this.repo.count({
      where: {
        status: 'ATIVO',
        dataPrevistaDevolucao: LessThan(new Date()),
      },
    });
    const dbDuration = Date.now() - dbStartTime;

    const stats = {
      total,
      ativos,
      devolvidos,
      atrasados,
    };

    // Salvar no cache com TTL de 1 minuto (60 segundos)
    await this.cacheManager.set(cacheKey, stats, 60000);
    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `💾 [CACHE SET] Estatisticas | TTL: 1min | Tempo DB: ${dbDuration}ms | Tempo Total: ${totalDuration}ms`,
    );

    return stats;
  }

  // Método auxiliar para invalidar cache relacionado a empréstimos
  private async invalidarCacheEmprestimos(motivo: string): Promise<void> {
    const startTime = Date.now();
    await this.cacheManager.del('emprestimos:all');
    await this.cacheManager.del('emprestimos:estatisticas');
    // Nota: Não é possível iterar sobre todas as keys no cache-manager v5+
    // Para invalidar caches de usuários específicos, seria necessário manter uma lista separada
    // ou usar um padrão diferente. Por enquanto, apenas invalidamos os caches principais.
    const duration = Date.now() - startTime;
    this.logger.warn(
      `🗑️ [CACHE INVALIDATE] Listagem + Estatisticas removidos | Motivo: ${motivo} | Tempo: ${duration}ms`,
    );
  }

  private async publicarEventoEmprestimoCriado(
    emprestimo: Emprestimo,
    livroResponse: any,
  ): Promise<void> {
    try {
      // O httpService retorna { data: { success, data: { id_livro, titulo, ... }, message } }
      const livroData = livroResponse?.data?.data || livroResponse?.data;
      const livroTitulo = livroData?.titulo || `Livro #${emprestimo.idLivro}`;

      await this.redisPublisher.publicarEmprestimoCriado({
        userId: String(emprestimo.idUsuario),
        livroId: String(emprestimo.idLivro),
        livroTitulo,
        emprestimoId: String(emprestimo.id),
        data:
          emprestimo.dataEmprestimo?.toISOString() || new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('❌ Erro ao publicar evento emprestimo.criado:', error);
    }
  }

  private async publicarEventoLivroDevolvido(
    emprestimo: Emprestimo,
  ): Promise<void> {
    try {
      const livroResponse: any = await this.httpService
        .getLivro(emprestimo.idLivro)
        .catch(() => null);
      const livroData = livroResponse?.data?.data || livroResponse?.data;
      const livroTitulo = livroData?.titulo || `Livro #${emprestimo.idLivro}`;

      await this.redisPublisher.publicarLivroDevolvido({
        userId: String(emprestimo.idUsuario),
        livroId: String(emprestimo.idLivro),
        livroTitulo,
        emprestimoId: String(emprestimo.id),
        data:
          emprestimo.dataDevolucao?.toISOString() || new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('❌ Erro ao publicar evento livro.devolvido:', error);
    }
  }
}
