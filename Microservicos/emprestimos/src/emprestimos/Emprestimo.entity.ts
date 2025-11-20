import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type EmprestimoStatus = 'ATIVO' | 'DEVOLVIDO' | 'ATRASADO';

@Entity({ name: 'emprestimos' })
export class Emprestimo {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'id_usuario' })
  idUsuario!: number;

  @Column({ name: 'id_livro' })
  idLivro!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'data_emprestimo' })
  dataEmprestimo?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'data_prevista_devolucao',
  })
  dataPrevistaDevolucao?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'data_devolucao' })
  dataDevolucao?: Date;

  @Column({
    type: 'enum',
    enum: ['ATIVO', 'DEVOLVIDO', 'ATRASADO'],
    default: 'ATIVO',
  })
  status!: EmprestimoStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
