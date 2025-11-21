import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notificacao')
export class Notificacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100, name: 'userId' })
  userId: string;

  @Column({ type: 'varchar', length: 180 })
  titulo: string;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  enviada: boolean;

  @Column({ type: 'boolean', default: false })
  lida: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
