# 📚 API Routes - Biblioteca Integrado

## 🚀 Base URL

```
http://localhost:3001/api
```

## 📋 Endpoints Disponíveis

### 👥 **Usuários** (`/usuarios`)

| Método | Endpoint           | Descrição                |
| ------ | ------------------ | ------------------------ |
| GET    | `/usuarios`        | Listar todos os usuários |
| GET    | `/usuarios/:id`    | Buscar usuário por ID    |
| GET    | `/usuarios/ra/:ra` | Buscar usuário por RA    |
| POST   | `/usuarios`        | Criar novo usuário       |
| PUT    | `/usuarios/:id`    | Atualizar usuário        |
| DELETE | `/usuarios/:id`    | Deletar usuário          |
| POST   | `/usuarios/login`  | Login de usuário         |

**Exemplo de criação de usuário:**

```json
POST /api/usuarios
{
  "nome": "Gabriel Speciam",
  "email": "gabrielSpeciam@email.com",
  "senha": "123456",
  "RA": "123456",
  "tipo": "aluno"
}
```

**Tipos de usuário disponíveis:**
- `"adm"` - Administrador
- `"funcionario"` - Funcionário
- `"aluno"` - Aluno

### 📖 **Livros** (`/livros`)

| Método | Endpoint                         | Descrição                            |
| ------ | -------------------------------- | ------------------------------------ |
| GET    | `/livros`                        | Listar todos os livros (com filtros) |
| GET    | `/livros/disponiveis`            | Listar livros disponíveis            |
| GET    | `/livros/categoria/:categoriaId` | Listar livros por categoria          |
| GET    | `/livros/:id`                    | Buscar livro por ID                  |
| POST   | `/livros`                        | Criar novo livro                     |
| PUT    | `/livros/:id`                    | Atualizar livro                      |
| DELETE | `/livros/:id`                    | Deletar livro                        |
| PATCH  | `/livros/:id/quantidade`         | Atualizar quantidade                 |

**Filtros para GET /livros:**

- `?page=1&limit=10` - Paginação
- `?search=termo` - Buscar por título ou autor
- `?categoria=1` - Filtrar por categoria

**Exemplo de criação de livro:**

```json
POST /api/livros
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "id_categoria": 1,
  "ano_publicacao": 1899,
  "capa_url": "https://exemplo.com/capas/dom_casmurro.jpg",
  "sinopse": "A clássica história de Bentinho e Capitu, narrada sob a perspectiva do ciúme e da dúvida.",
  "prateleira": "A-12",
  "isbn": "978-85-359-0277-3",
  "qt_atual": 3,
  "qt_total": 5
}
```

### 🏷️ **Categorias** (`/categorias`)

| Método | Endpoint                       | Descrição                  |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/categorias`                  | Listar todas as categorias |
| GET    | `/categorias/:id`              | Buscar categoria por ID    |
| GET    | `/categorias/nome/:nome`       | Buscar categoria por nome  |
| GET    | `/categorias/:id/estatisticas` | Estatísticas da categoria  |
| POST   | `/categorias`                  | Criar nova categoria       |
| PUT    | `/categorias/:id`              | Atualizar categoria        |
| DELETE | `/categorias/:id`              | Deletar categoria          |

**Exemplo de criação de categoria:**

```json
POST /api/categorias
{
  "nome": "Ficção Científica"
}
```

### 📚 **Empréstimos** (`/emprestimos`)

| Método | Endpoint                          | Descrição                    |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/emprestimos`                    | Listar todos os empréstimos  |
| GET    | `/emprestimos/ativos`             | Listar empréstimos ativos    |
| GET    | `/emprestimos/atrasados`          | Listar empréstimos atrasados |
| GET    | `/emprestimos/usuario/:usuarioId` | Empréstimos por usuário      |
| GET    | `/emprestimos/estatisticas`       | Estatísticas de empréstimos  |
| GET    | `/emprestimos/:id`                | Buscar empréstimo por ID     |
| POST   | `/emprestimos`                    | Criar novo empréstimo        |
| PUT    | `/emprestimos/:id/devolver`       | Devolver livro               |
| PUT    | `/emprestimos/:id/renovar`        | Renovar empréstimo           |
| DELETE | `/emprestimos/:id`                | Deletar empréstimo           |

**Filtros para GET /emprestimos:**

- `?page=1&limit=10` - Paginação
- `?status=ativo` - Filtrar por status
- `?usuario=1` - Filtrar por usuário
- `?livro=1` - Filtrar por livro

**Exemplo de criação de empréstimo:**

```json
POST /api/emprestimos
{
  "id_usuario": 1,
  "id_livro": 1,
  "data_devolucao_prevista": "2024-02-15"
}
```

### ❤️ **Favoritos** (`/favoritos`)

| Método | Endpoint                                       | Descrição                   |
| ------ | ---------------------------------------------- | --------------------------- |
| GET    | `/favoritos`                                   | Listar todos os favoritos   |
| GET    | `/favoritos/usuario/:usuarioId`                | Favoritos por usuário       |
| GET    | `/favoritos/livro/:livroId`                    | Favoritos por livro         |
| GET    | `/favoritos/usuario/:usuarioId/livro/:livroId` | Verificar se é favorito     |
| GET    | `/favoritos/estatisticas`                      | Estatísticas de favoritos   |
| GET    | `/favoritos/:id`                               | Buscar favorito por ID      |
| POST   | `/favoritos`                                   | Adicionar aos favoritos     |
| POST   | `/favoritos/toggle`                            | Alternar favorito           |
| DELETE | `/favoritos/:id`                               | Remover favorito            |
| DELETE | `/favoritos/usuario/:usuarioId/livro/:livroId` | Remover por usuário e livro |

**Exemplo de adicionar favorito:**

```json
POST /api/favoritos
{
  "id_usuario": 1,
  "id_livro": 1
}
```

**Exemplo de toggle favorito:**

```json
POST /api/favoritos/toggle
{
  "id_usuario": 1,
  "id_livro": 1
}
```

## 🔧 **Endpoints Especiais**

### Health Check

```
GET /api/health
```

### Informações da API

```
GET /api/
```

## 📝 **Respostas Padrão**

### Sucesso

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Erro

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Detalhes do erro"
}
```

### Paginação

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "Dados listados com sucesso"
}
```

## 🚦 **Códigos de Status HTTP**

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (dados já existem)
- `500` - Erro interno do servidor

## 🔍 **Exemplos de Uso**

### Buscar livros com filtros

```
GET /api/livros?search=harry&categoria=1&page=1&limit=5
```

### Listar empréstimos ativos de um usuário

```
GET /api/emprestimos/usuario/1?status=ativo
```

### Verificar se livro é favorito

```
GET /api/favoritos/usuario/1/livro/5
```

---

**🎉 Sua API está pronta para uso!**
