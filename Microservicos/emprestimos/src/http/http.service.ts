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

@Injectable()
export class HttpServiceMicro {
  private BaseURL = process.env.BACKEND || 'http://backend:3001';

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
  // NOTE: reservation endpoints from the monolith are intentionally not used
  // by this microservice. The emprestimos microservice implements its own
  // reservation/queue logic internally.
}
