import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type EmprestimoStatus = 'ativo' | 'devolvido' | 'atrasado';

@Entity({ name: 'emprestimos' })
export class Emprestimo {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  id_usuario!: number;

  @Column()
  id_livro!: number;

  @Column({ type: 'timestamp' })
  data_emprestimo!: Date;

  @Column({ type: 'timestamp' })
  data_devolucao_prevista!: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_devolucao_real?: Date;

  @Column({ type: 'varchar', length: 20, default: 'ativo' })
  status!: EmprestimoStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
