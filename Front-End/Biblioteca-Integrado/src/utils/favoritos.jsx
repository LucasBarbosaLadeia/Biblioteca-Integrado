import { api } from "../services/api";

export const toggleFavorito = async (usuarioId, livroId, token) => {
  try {
    const body = { id_usuario: usuarioId, id_livro: livroId };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const data = await api.post("favoritos/toggle", body, { headers });
    return data;
  } catch (error) {
    console.error("Erro na função toggleFavorito:", error);
    throw error;
  }
};
