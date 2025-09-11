export const toggleFavorito = async (usuarioId, livroId, token) => {
  try {
    const response = await fetch(
      "http://192.168.0.103:3001/api/favoritos/toggle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: usuarioId,
          id_livro: livroId,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na função toggleFavorito:", error);
    throw error;
  }
};
