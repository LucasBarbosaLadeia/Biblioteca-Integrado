import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Reserva, ReservaStatus } from '../reserva.entity';
import { HttpServiceMicro } from '../../http/http.service';
import { RedisPublisher } from '../../redis/redis.publisher';

@Injectable()
export class ExpireReservasJob {
  private readonly logger = new Logger(ExpireReservasJob.name);
  private isRunning = false;

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    private readonly httpService: HttpServiceMicro,
    private readonly redisPublisher: RedisPublisher,
  ) {}

  /**
   * Job que executa a cada 30 minutos para expirar reservas vencidas
   * Processa reservas com dataLimiteRetirada expirada
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleExpireReservas() {
    // Prevenir execução concorrente
    if (this.isRunning) {
      this.logger.warn(
        '⚠️ [CRON] Job de expiração já está em execução, pulando esta execução',
      );
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      this.logger.log('🕐 [CRON] Iniciando verificação de reservas expiradas');

      const agora = new Date();

      // Buscar todas as reservas PENDENTE com prazo expirado
      // Apenas reservas com dataLimiteRetirada definida (livros que estavam disponíveis)
      const reservasExpiradas = await this.reservaRepo.find({
        where: {
          status: ReservaStatus.PENDENTE,
          dataLimiteRetirada: LessThan(agora),
        },
        order: { dataLimiteRetirada: 'ASC' },
      });

      if (reservasExpiradas.length === 0) {
        this.logger.log('✅ [CRON] Nenhuma reserva expirada encontrada');
        return;
      }

      this.logger.log(
        `📋 [CRON] Encontradas ${reservasExpiradas.length} reserva(s) expirada(s)`,
      );

      let sucessos = 0;
      let falhas = 0;

      // Processar cada reserva expirada
      for (const reserva of reservasExpiradas) {
        try {
          await this.processarReservaExpirada(reserva);
          sucessos++;
        } catch (error) {
          falhas++;
          this.logger.error(
            `❌ [CRON] Erro ao processar reserva ${reserva.id}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ [CRON] Processamento concluído em ${duration}ms | Sucessos: ${sucessos} | Falhas: ${falhas}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ [CRON] Erro fatal no job de expiração:',
        error instanceof Error ? error.stack : error,
      );
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Processa uma reserva expirada:
   * 1. Marca como EXPIRADA
   * 2. Incrementa estoque do livro
   * 3. Publica notificação de expiração
   * 4. Chama próximo da fila (se houver)
   */
  private async processarReservaExpirada(reserva: Reserva): Promise<void> {
    const livroId = Number(reserva.livroId);
    const tempoExpirado = Math.floor(
      (Date.now() - new Date(reserva.dataLimiteRetirada!).getTime()) /
        (1000 * 60),
    );

    this.logger.log(
      `🔄 [CRON] Processando reserva expirada | ID: ${reserva.id} | Livro: ${livroId} | Usuário: ${reserva.alunoId} | Expirada há ${tempoExpirado} min`,
    );

    // 1. Marcar reserva como EXPIRADA
    reserva.status = ReservaStatus.EXPIRADA;
    reserva.updatedAt = new Date();
    await this.reservaRepo.save(reserva);

    this.logger.log(`✅ [CRON] Reserva ${reserva.id} marcada como EXPIRADA`);

    // 2. Incrementar estoque do livro
    try {
      await this.httpService.incrementarEstoque(livroId);
      this.logger.log(`✅ [CRON] Estoque do livro ${livroId} incrementado`);
    } catch (error) {
      this.logger.error(
        `❌ [CRON] Erro ao incrementar estoque do livro ${livroId}:`,
        error instanceof Error ? error.message : error,
      );
      throw error; // Re-lançar para marcar como falha
    }

    // 3. Publicar notificação de reserva expirada
    await this.publicarNotificacaoExpiracao(reserva, livroId, tempoExpirado);

    // 4. Verificar se há próximo na fila
    await this.chamarProximoDaFila(livroId);
  }

  /**
   * Chama o próximo usuário da fila para o livro
   * Se houver próximo, decrementa estoque e atualiza reserva com prazo de 24h
   * Se não houver próximo, apenas incrementa o estoque (já foi incrementado acima)
   */
  private async chamarProximoDaFila(livroId: number): Promise<void> {
    // Buscar próximo da fila com posicaoFila definida (reservas em fila)
    const proximo = await this.reservaRepo
      .createQueryBuilder('r')
      .where('r.livroId = :livroId', { livroId: String(livroId) })
      .andWhere('r.status = :status', { status: ReservaStatus.PENDENTE })
      .andWhere('r.posicaoFila IS NOT NULL')
      .orderBy('r.posicaoFila', 'ASC')
      .getOne();

    if (!proximo) {
      this.logger.log(
        `ℹ️ [CRON] Nenhum usuário na fila para o livro ${livroId}`,
      );
      // Estoque já foi incrementado, livro fica disponível
      return;
    }

    this.logger.log(
      `🔔 [CRON] Chamando próximo da fila | Reserva: ${proximo.id} | Usuário: ${proximo.alunoId} | Posição: ${proximo.posicaoFila}`,
    );

    try {
      // Decrementar estoque (livro fica reservado para o próximo)
      await this.httpService.decrementarEstoque(livroId);

      // Atualizar reserva com prazo de 24h
      const limite = new Date();
      limite.setHours(limite.getHours() + 24);

      proximo.dataLimiteRetirada = limite;
      proximo.posicaoFila = null; // Remove da fila, agora tem prazo direto
      proximo.updatedAt = new Date();
      await this.reservaRepo.save(proximo);

      this.logger.log(
        `✅ [CRON] Próximo usuário notificado | Prazo até: ${limite.toISOString()}`,
      );

      // TODO: Publicar evento Redis para notificar usuário
      // await this.redisPublisher.publicarReservaDisponivel(...)
    } catch (error) {
      this.logger.error(
        `❌ [CRON] Erro ao chamar próximo da fila para livro ${livroId}:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Publica notificação de reserva expirada para o usuário
   */
  private async publicarNotificacaoExpiracao(
    reserva: Reserva,
    livroId: number,
    tempoExpirado: number,
  ): Promise<void> {
    try {
      const livroResponse = await this.httpService
        .getLivro(livroId)
        .catch(() => null);
      const livroData = livroResponse?.data as { titulo?: string } | undefined;
      const livroTitulo = (livroData?.titulo as string) || `Livro #${livroId}`;

      await this.redisPublisher.publicarReservaExpirada({
        userId: String(reserva.alunoId),
        livroId: String(livroId),
        livroTitulo: livroTitulo,
        reservaId: String(reserva.id),
        data: new Date().toISOString(),
        tempoExpirado: tempoExpirado,
      });

      this.logger.log(
        `📨 [CRON] Notificação de expiração enviada para usuário ${reserva.alunoId}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ [CRON] Erro ao publicar notificação de expiração:',
        error instanceof Error ? error.message : error,
      );
      // Não re-lançar erro, notificação é secundária
    }
  }

  /**
   * Método manual para forçar execução do job (útil para testes)
   */
  async executeManual(): Promise<{
    processadas: number;
    sucessos: number;
    falhas: number;
  }> {
    const startTime = Date.now();
    this.logger.log('🔧 [MANUAL] Execução manual do job iniciada');

    const agora = new Date();
    const reservasExpiradas = await this.reservaRepo.find({
      where: {
        status: ReservaStatus.PENDENTE,
        dataLimiteRetirada: LessThan(agora),
      },
    });

    let sucessos = 0;
    let falhas = 0;

    for (const reserva of reservasExpiradas) {
      try {
        await this.processarReservaExpirada(reserva);
        sucessos++;
      } catch {
        falhas++;
      }
    }

    const duration = Date.now() - startTime;
    this.logger.log(
      `✅ [MANUAL] Execução concluída em ${duration}ms | Total: ${reservasExpiradas.length} | Sucessos: ${sucessos} | Falhas: ${falhas}`,
    );

    return {
      processadas: reservasExpiradas.length,
      sucessos,
      falhas,
    };
  }
}
