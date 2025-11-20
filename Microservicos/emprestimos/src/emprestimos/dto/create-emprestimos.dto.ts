import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateEmprestimoDto {
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsNumber({}, { message: 'ID do usuário deve ser um número' })
  @IsPositive({ message: 'ID do usuário deve ser positivo' })
  @Min(1, { message: 'ID do usuário deve ser no mínimo 1' })
  idUsuario!: number;

  @IsNotEmpty({ message: 'ID do livro é obrigatório' })
  @IsNumber({}, { message: 'ID do livro deve ser um número' })
  @IsPositive({ message: 'ID do livro deve ser positivo' })
  @Min(1, { message: 'ID do livro deve ser no mínimo 1' })
  idLivro!: number;

  @IsNotEmpty({ message: 'Data de devolução prevista é obrigatória' })
  @IsDateString(
    {},
    {
      message: 'Data de devolução prevista deve ser uma data válida (ISO 8601)',
    },
  )
  dataPrevistaDevolucao!: string;
}
