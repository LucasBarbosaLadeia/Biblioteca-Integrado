import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// Enums para o Status
export enum ReservaStatus {
  PENDENTE_RETIRADA = 'PENDENTE_RETIRADA', // Livro disponível, aluno tem prazo para retirar
  NA_FILA = 'NA_FILA', // Livro indisponível, aluno está na fila
  DISPONIVEL_PARA_COLETA = 'DISPONIVEL_PARA_COLETA', // Livro voltou, aluno foi notificado e tem prazo
  RETIRADA = 'RETIRADA',
  EXPIRADA = 'EXPIRADA',
  CANCELADA = 'CANCELADA',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  livroId!: string;

  @Column()
  alunoId!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  dataReserva!: Date;

  @Column({ type: 'enum', enum: ReservaStatus, default: ReservaStatus.NA_FILA })
  status!: ReservaStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dataLimiteRetirada!: Date | null;

  @Column({ type: 'int', nullable: true })
  posicaoFila!: number | null;

  @Column({ type: 'varchar', nullable: true })
  emprestimoId!: string | null;
}
