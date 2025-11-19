// Enums para o Status
export enum ReservaStatus {
  PENDENTE_RETIRADA = 'PENDENTE_RETIRADA', // Livro disponível, aluno tem prazo para retirar
  NA_FILA = 'NA_FILA', // Livro indisponível, aluno está na fila
  DISPONIVEL_PARA_COLETA = 'DISPONIVEL_PARA_COLETA', // Livro voltou, aluno foi notificado e tem prazo
  RETIRADA = 'RETIRADA',
  EXPIRADA = 'EXPIRADA',
  CANCELADA = 'CANCELADA',
}

// Entidade de Reserva (adaptar para o seu ORM/Framework)
export class Reserva {
  // ID da Reserva (Chave Primária)
  id: string;

  // ID do Livro (Foreign Key)
  livroId: string;

  // ID do Aluno (Foreign Key)
  alunoId: string;

  // Quando a reserva foi criada
  dataReserva: Date;

  // Status atual da reserva
  status: ReservaStatus = ReservaStatus.NA_FILA;

  // Data e Hora limite para o aluno retirar o livro ou para a notificação expirar.
  dataLimiteRetirada: Date | null;

  // Posição na fila (se status for NA_FILA)
  posicaoFila: number | null;

  // ID do Empréstimo criado a partir desta reserva (se houver)
  emprestimoId: string | null;

  constructor(
    livroId: string,
    alunoId: string,
    status: ReservaStatus = ReservaStatus.NA_FILA,
    posicaoFila: number | null = null,
  ) {
    this.id = Math.random().toString(36).substring(2); // Simples ID para exemplo
    this.livroId = livroId;
    this.alunoId = alunoId;
    this.dataReserva = new Date();
    this.status = status;
    this.posicaoFila = posicaoFila;
    this.dataLimiteRetirada = null;
    this.emprestimoId = null;
  }
}
