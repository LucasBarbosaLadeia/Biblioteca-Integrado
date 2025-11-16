import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

// Interfaces para tipagem segura
export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  // outras propriedades
}

export interface Livro {
  id_livro: number;
  titulo: string;
  qt_atual: number;
  // outras propriedades
}

export interface Reserva {
  id_reserva: number;
  id_usuario: number;
  id_livro: number;
  status: string;
  data_reserva: string;
  data_expiracao: string;
}

@Injectable()
export class HttpServiceMicro {
  private BaseURL = process.env.BACKEND || 'http://backend:3001/api';

  async getUsuario(id: number): Promise<AxiosResponse<Usuario>> {
    return axios.get<Usuario>(`${this.BaseURL}/usuarios/${id}`);
  }

  async getLivro(id: number): Promise<AxiosResponse<Livro>> {
    return axios.get<Livro>(`${this.BaseURL}/livros/${id}`);
  }

  async decrementarEstoque(id: number): Promise<AxiosResponse<void>> {
    return axios.patch(`${this.BaseURL}/livros/${id}/decrementar`);
  }

  async incrementarEstoque(id: number): Promise<AxiosResponse<void>> {
    return axios.patch(`${this.BaseURL}/livros/${id}/incrementar`);
  }

  async verificarReserva(
    id_usuario: number,
    id_livro: number,
  ): Promise<AxiosResponse<Reserva>> {
    return axios.get<Reserva>(
      `${this.BaseURL}/reservas/ativa/${id_usuario}/${id_livro}`,
    );
  }

  async concretizarReserva(id_reserva: number): Promise<AxiosResponse<void>> {
    return axios.patch(`${this.BaseURL}/reservas/${id_reserva}/concretizar`);
  }
}
