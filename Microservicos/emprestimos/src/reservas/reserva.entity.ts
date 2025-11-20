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

  @Column({ name: 'id_livro', nullable: false })
  livroId!: string;

  @Column({ name: 'id_usuario', nullable: false })
  alunoId!: string;

  @CreateDateColumn({ name: 'data_reserva', type: 'timestamptz' })
  dataReserva!: Date;

  @Column({ type: 'enum', enum: ReservaStatus, default: ReservaStatus.NA_FILA })
  status!: ReservaStatus;

  @Column({ name: 'data_limite_retirada', type: 'timestamptz', nullable: true })
  dataLimiteRetirada!: Date | null;

  @Column({ name: 'posicao_fila', type: 'int', nullable: true })
  posicaoFila!: number | null;

  @Column({ name: 'id_emprestimo', type: 'int', nullable: true })
  emprestimoId!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
