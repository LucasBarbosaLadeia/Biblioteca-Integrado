import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EventoStatus {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  CONCLUIDO = 'CONCLUIDO',
  FALHOU = 'FALHOU',
  FALHOU_PERMANENTE = 'FALHOU_PERMANENTE',
}

export enum EventoTipo {
  EMPRESTIMO_CRIADO = 'EMPRESTIMO_CRIADO',
  LIVRO_DEVOLVIDO = 'LIVRO_DEVOLVIDO',
  RESERVA_DISPONIVEL = 'RESERVA_DISPONIVEL',
  RESERVA_EXPIRADA = 'RESERVA_EXPIRADA',
}

@Entity('evento_fila')
@Index(['status', 'tentativas'])
@Index(['tipo', 'status'])
export class EventoFila {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'enum',
    enum: EventoTipo,
  })
  tipo: EventoTipo;

  @Index()
  @Column({
    type: 'enum',
    enum: EventoStatus,
    default: EventoStatus.PENDENTE,
  })
  status: EventoStatus;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  tentativas: number;

  @Column({ type: 'int', default: 3 })
  maxTentativas: number;

  @Column({ type: 'text', nullable: true })
  ultimoErro?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  processadoEm?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  proximaTentativaEm?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
