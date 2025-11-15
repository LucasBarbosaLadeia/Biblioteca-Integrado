import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Emprestimo {
  @PrimaryGeneratedColumn()
  id: number; // Definição das propriedades da entidade Emprestimo

  @Column()
  id_usuario: number;

  @Column()
  id_livro: number;

  @Column({ type: 'date' })
  data_emprestimo: Date;

  @Column({ type: 'date' })
  data_devolucao_prevista: Date;

  @Column({ type: 'date', nullable: true })
  data_devolucao_real?: Date;

  @Column({
    type: 'enum',
    enum: ['ativo', 'devolvido', 'atrasado'],
    default: 'ativo',
  })
  status: 'ativo' | 'devolvido' | 'atrasado';

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
