-- ==========

npm run dev ---- para rodar o back 🚬

-- ==========


-- ========================
-- Tabela USUÁRIOS
-- ========================
CREATE TABLE usuarios (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(255) NOT NULL,
RA VARCHAR(20) UNIQUE NOT NULL,
tipo ENUM('aluno', 'funcionario') NOT NULL
);

-- ========================
-- Tabela CATEGORIAS
-- ========================
CREATE TABLE categorias (
id_categoria INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(50) NOT NULL
);

-- ========================
-- Tabela LIVROS
-- ========================
CREATE TABLE livros (
id_livro INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
autor VARCHAR(100) NOT NULL,
id_categoria INT NOT NULL,
ano_publicacao INT,
capa_url TEXT,
sinopse TEXT,
prateleira VARCHAR(50),
isbn VARCHAR(20) UNIQUE,
qt_atual INT NOT NULL,
qt_total INT NOT NULL,
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- ========================
-- Tabela FAVORITOS
-- ========================
CREATE TABLE favoritos (
id_favorito INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_livro INT NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_livro) REFERENCES livros(id_livro),
UNIQUE(id_usuario, id_livro)
);

-- ========================
-- Tabela EMPRESTIMOS
-- ========================
CREATE TABLE emprestimos (
id_emprestimo INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_livro INT NOT NULL,
data_emprestimo DATE NOT NULL,
data_devolucao_prevista DATE NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_livro) REFERENCES livros(id_livro)
);
