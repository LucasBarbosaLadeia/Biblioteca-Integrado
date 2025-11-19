import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reserva_fila')
export class ReservaFila {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  livroId: string;

  @Column()
  alunoId: string;

  @Column({ type: 'int' })
  posicao: number;

  @CreateDateColumn()
  criadoEm: Date;
}
