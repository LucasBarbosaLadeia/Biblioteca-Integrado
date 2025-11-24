import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import {
  EventoFila,
  EventoStatus,
  EventoTipo,
} from '../entitys/eventoFila.entity';
import { NotificationPushService } from './notification-push.service';
import { Cron } from '@nestjs/schedule';

interface EmprestimoCriadoPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  emprestimoId: string;
  data: string;
}

interface LivroDevolvidoPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  emprestimoId: string;
  data: string;
}

interface ReservaDisponivelPayload {
  userId: string;
  livroId: string;
  livroTitulo: string;
  reservaId: string;
  data: string;
}

@Injectable()
export class FilaService {
  private readonly logger = new Logger(FilaService.name);
  private processandoFila = false;

  constructor(
    @InjectRepository(EventoFila)
    private readonly filaRepo: Repository<EventoFila>,
    private readonly pushService: NotificationPushService,
  ) {}

  async adicionarEvento(
    tipo: EventoTipo,
    payload: Record<string, any>,
    maxTentativas = 5,
  ): Promise<EventoFila> {
    const evento = this.filaRepo.create({
      tipo,
      payload,
      status: EventoStatus.PENDENTE,
      maxTentativas,
      tentativas: 0,
    });

    const saved = await this.filaRepo.save(evento);
    this.logger.log(
      `📥 [FILA] Novo evento adicionado: ${tipo} | ID: ${saved.id}`,
    );

    // Tentar processar imediatamente
    void this.processarEventoPendente(saved.id);

    return saved;
  }

  // Cron job que roda a cada 30 segundos para processar eventos pendentes
  @Cron('*/30 * * * * *')
  async processarFilaPeriodicamente(): Promise<void> {
    if (this.processandoFila) {
      this.logger.debug('⏭️ [FILA] Processamento já em andamento, pulando...');
      return;
    }

    this.processandoFila = true;

    try {
      // Buscar eventos pendentes ou que falharam mas podem tentar novamente
      const agora = new Date();
      const eventos = await this.filaRepo.find({
        where: [
          { status: EventoStatus.PENDENTE },
          {
            status: EventoStatus.FALHOU,
            proximaTentativaEm: LessThan(agora),
          },
        ],
        order: { createdAt: 'ASC' },
        take: 10, // Processar até 10 eventos por vez
      });

      if (eventos.length > 0) {
        this.logger.log(
          `🔄 [FILA] Processando ${eventos.length} evento(s) pendente(s)...`,
        );

        for (const evento of eventos) {
          await this.processarEventoPendente(evento.id);
          // Pequeno delay entre processamentos para evitar sobrecarga
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      this.logger.error(
        '❌ [FILA] Erro ao processar fila periódica:',
        error instanceof Error ? error.message : error,
      );
    } finally {
      this.processandoFila = false;
    }
  }

  private async processarEventoPendente(eventoId: string): Promise<void> {
    const evento = await this.filaRepo.findOne({ where: { id: eventoId } });

    if (!evento) {
      this.logger.warn(`⚠️ [FILA] Evento ${eventoId} não encontrado`);
      return;
    }

    // Se já está sendo processado ou concluído, ignorar
    if (
      [EventoStatus.PROCESSANDO, EventoStatus.CONCLUIDO].includes(evento.status)
    ) {
      return;
    }

    // Se excedeu o número de tentativas
    if (evento.tentativas >= evento.maxTentativas) {
      evento.status = EventoStatus.FALHOU_PERMANENTE;
      await this.filaRepo.save(evento);
      this.logger.error(
        `❌ [FILA] Evento ${eventoId} falhou permanentemente após ${evento.tentativas} tentativas`,
      );
      return;
    }

    try {
      // Marcar como processando
      evento.status = EventoStatus.PROCESSANDO;
      evento.tentativas += 1;
      await this.filaRepo.save(evento);

      this.logger.log(
        `⚙️ [FILA] Processando evento ${evento.tipo} | Tentativa ${evento.tentativas}/${evento.maxTentativas}`,
      );

      // Processar de acordo com o tipo
      await this.processarPorTipo(evento);

      // Marcar como concluído
      evento.status = EventoStatus.CONCLUIDO;
      evento.processadoEm = new Date();
      evento.ultimoErro = null;
      await this.filaRepo.save(evento);

      this.logger.log(
        `✅ [FILA] Evento ${evento.tipo} processado com sucesso | ID: ${eventoId}`,
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : JSON.stringify(error);

      evento.status = EventoStatus.FALHOU;
      evento.ultimoErro = errorMsg;

      // Calcular próxima tentativa com backoff exponencial
      const delayMinutos = Math.min(Math.pow(2, evento.tentativas) * 1, 60); // Max 60 min
      evento.proximaTentativaEm = new Date(
        Date.now() + delayMinutos * 60 * 1000,
      );

      await this.filaRepo.save(evento);

      this.logger.error(
        `❌ [FILA] Erro ao processar evento ${evento.tipo} | Tentativa ${evento.tentativas}/${evento.maxTentativas} | Próxima tentativa em ${delayMinutos}min | Erro: ${errorMsg}`,
      );
    }
  }

  private async processarPorTipo(evento: EventoFila): Promise<void> {
    switch (evento.tipo) {
      case EventoTipo.EMPRESTIMO_CRIADO:
        await this.pushService.sendEmprestimoCriadoNotification(
          evento.payload as EmprestimoCriadoPayload,
        );
        break;

      case EventoTipo.LIVRO_DEVOLVIDO:
        await this.pushService.sendLivroDevolvidoNotification(
          evento.payload as LivroDevolvidoPayload,
        );
        break;

      case EventoTipo.RESERVA_DISPONIVEL:
        await this.pushService.sendReservaDisponivelNotification(
          evento.payload as ReservaDisponivelPayload,
        );
        break;
    }
  }

  // Métodos para estatísticas e monitoramento
  async obterEstatisticas() {
    const [
      total,
      pendentes,
      processando,
      concluidos,
      falhos,
      falhosPermanentes,
    ] = await Promise.all([
      this.filaRepo.count(),
      this.filaRepo.count({ where: { status: EventoStatus.PENDENTE } }),
      this.filaRepo.count({ where: { status: EventoStatus.PROCESSANDO } }),
      this.filaRepo.count({ where: { status: EventoStatus.CONCLUIDO } }),
      this.filaRepo.count({ where: { status: EventoStatus.FALHOU } }),
      this.filaRepo.count({
        where: { status: EventoStatus.FALHOU_PERMANENTE },
      }),
    ]);

    return {
      total,
      pendentes,
      processando,
      concluidos,
      falhos,
      falhosPermanentes,
      taxaSucesso:
        total > 0 ? ((concluidos / total) * 100).toFixed(2) + '%' : '0%',
    };
  }

  async obterEventosFalhos(limit = 20): Promise<EventoFila[]> {
    return this.filaRepo.find({
      where: {
        status: In([EventoStatus.FALHOU, EventoStatus.FALHOU_PERMANENTE]),
      },
      order: { updatedAt: 'DESC' },
      take: limit,
    });
  }

  async reprocessarEvento(eventoId: string): Promise<void> {
    const evento = await this.filaRepo.findOne({ where: { id: eventoId } });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.status === EventoStatus.CONCLUIDO) {
      throw new Error('Evento já foi processado com sucesso');
    }

    // Resetar status para permitir reprocessamento
    evento.status = EventoStatus.PENDENTE;
    evento.tentativas = 0;
    evento.ultimoErro = null;
    evento.proximaTentativaEm = null;
    await this.filaRepo.save(evento);

    this.logger.log(
      `🔄 [FILA] Evento ${eventoId} marcado para reprocessamento`,
    );

    // Tentar processar imediatamente
    await this.processarEventoPendente(eventoId);
  }

  async limparEventosConcluidos(diasAtras = 7): Promise<number> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const result = await this.filaRepo.delete({
      status: EventoStatus.CONCLUIDO,
      processadoEm: LessThan(dataLimite),
    });

    const deletados = result.affected || 0;
    this.logger.log(
      `🗑️ [FILA] ${deletados} evento(s) concluído(s) antigo(s) removido(s)`,
    );

    return deletados;
  }
}
