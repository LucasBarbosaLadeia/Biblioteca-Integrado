import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateEmprestimoDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario!: number;

  @IsNotEmpty()
  @IsNumber()
  id_livro!: number;

  @IsDateString()
  data_devolucao_prevista!: string;
}
