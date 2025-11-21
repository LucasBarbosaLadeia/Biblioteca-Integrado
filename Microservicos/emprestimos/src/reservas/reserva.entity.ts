import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// Enums para o Status
export enum ReservaStatus {
  PENDENTE = 'PENDENTE', // Reserva aguardando retirada
  ATENDIDA = 'ATENDIDA', // Reserva retirada (empréstimo criado)
  EXPIRADA = 'EXPIRADA', // Prazo de retirada expirado
  CANCELADA = 'CANCELADA', // Reserva cancelada
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'id_livro', nullable: false })
  livroId!: string;

  @Column({ name: 'id_usuario', nullable: false })
  alunoId!: string;

  @Column({
    name: 'data_reserva',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataReserva!: Date;

  @Column({
    type: 'enum',
    enum: ReservaStatus,
    default: ReservaStatus.PENDENTE,
  })
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
