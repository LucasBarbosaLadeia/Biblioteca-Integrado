import Usuario from "./Usuario";
import Categoria from "./Categoria";
import Livro from "./Livro";
import Favorito from "./Favorito";
// REMOVIDO - Empréstimos e Reservas agora estão no microserviço

// Relação: Usuario -> Livros (através de Favoritos)
Usuario.belongsToMany(Livro, {
  through: Favorito,
  foreignKey: "id_usuario",
  otherKey: "id_livro",
  as: "livrosFavoritos",
});

// Relação: Livro -> Usuarios (através de Favoritos)
Livro.belongsToMany(Usuario, {
  through: Favorito,
  foreignKey: "id_livro",
  otherKey: "id_usuario",
  as: "usuariosFavoritos",
});

// Relação: Categoria -> Livros (1:N)
Categoria.hasMany(Livro, {
  foreignKey: "id_categoria",
  as: "livros",
});

// Relação: Livro -> Categoria (N:1)
Livro.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

// Relação: Usuario -> Favoritos (1:N)
Usuario.hasMany(Favorito, {
  foreignKey: "id_usuario",
  as: "favoritos",
});

// Relação: Favorito -> Usuario (N:1)
Favorito.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Relação: Livro -> Favoritos (1:N)
Livro.hasMany(Favorito, {
  foreignKey: "id_livro",
  as: "favoritos",
});

// Relação: Favorito -> Livro (N:1)
Favorito.belongsTo(Livro, {
  foreignKey: "id_livro",
  as: "livro",
});

export { Usuario, Categoria, Livro, Favorito };
