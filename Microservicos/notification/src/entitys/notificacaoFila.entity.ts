import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notificacao } from './notificacao.entity';

@Entity('notificacao_fila')
export class NotificacaoFila {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  notificacaoId: string;

  @ManyToOne(() => Notificacao, { onDelete: 'CASCADE' })
  notificacao: Notificacao;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
