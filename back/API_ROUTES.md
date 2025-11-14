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

---

## 🛎️ Reservas (novo recurso)

### Endpoints

- `GET /api/reservas`

  - Lista todas as reservas (suporta `?page=&limit=`).

- `GET /api/reservas/usuario/:usuarioId`

  - Lista reservas de um usuário (paginado).

- `GET /api/reservas/:id`

  - Recupera reserva por ID.

- `POST /api/reservas`

  - Cria uma nova reserva.

  ### Endpoints (`/reservas`)

  | Método | Endpoint                       | Descrição                                            |
  | ------ | ------------------------------ | ---------------------------------------------------- |
  | GET    | `/reservas`                    | Listar todas as reservas (paginado: `?page=&limit=`) |
  | GET    | `/reservas/usuario/:usuarioId` | Listar reservas de um usuário (paginado)             |
  | GET    | `/reservas/:id`                | Buscar reserva por ID                                |
  | POST   | `/reservas`                    | Criar nova reserva (ver body abaixo)                 |
  | PUT    | `/reservas/:id/cancelar`       | Cancelar reserva ativa e repor estoque               |
  | PUT    | `/reservas/:id/concretizar`    | Marcar reserva como concretizada (retirada)          |

  **Body para POST /api/reservas**

  ```json
  POST /api/reservas
  {
    "id_usuario": 1,
    "id_livro": 2,
    "data_expiracao": "2025-11-15T12:00:00Z" // opcional
  }
  ```

  ### Filtros / parâmetros

  - `?page=1&limit=10` - Paginação para listagens.

  ### Regras de negócio (estoque)

  - Ao criar reserva:
    - Se `livro.qt_atual > 0` o backend decrementa `qt_atual` (bloqueia um exemplar) dentro de transação.
    - Se `livro.qt_atual === 0`, a reserva é criada como fila (não decrementa) — o usuário fica na lista de espera.
  - Ao cancelar reserva ativa: o backend marca `status = 'cancelada'` e incrementa `livro.qt_atual` (+1) dentro de transação.
  - Ao concretizar reserva (usuário retira o livro): a reserva recebe `status = 'concretizada'`. Se um empréstimo for criado a partir da reserva, não há decremento adicional de `qt_atual`.
  - Ao criar empréstimo sem reserva: comportamento anterior se mantém (decrementa `qt_atual`).

  ### Job: expirar reservas (limpeza automática)

  - Arquivo: `back/src/jobs/expireReservations.ts`.
  - O job procura reservas com `status = 'ativa'` cuja `data_expiracao < now` e para cada uma:
    - marca `status = 'expirada'` e
    - repõe `livro.qt_atual` (+1) dentro de transação.
  - Retorno: `{ expired: n }` com a quantidade de reservas processadas.

  ### Agendamento / Execução manual

  - Variáveis de ambiente para ativar agendamento em `src/index.ts`:
    - `ENABLE_RESERVAS_JOB=true` (ativa o job no start)
    - `RESERVAS_JOB_INTERVAL_MINUTES` (intervalo em minutos, padrão 5)
  - Execução manual para testes:

  ```powershell
  npx ts-node-dev --respawn --transpile-only src/jobs/expireReservations.ts
  ```

  ### Notas técnicas

  - As operações que alteram `qt_atual` usam transações Sequelize e locks (`UPDATE`) para reduzir race conditions.
  - O job usa `new Date()` (hora do servidor) para comparar `data_expiracao` — confira fuso horário ao testar.
  - Códigos de erro comuns relacionados a reservas:
    - `400` - sem exemplares disponíveis (quando necessário);
    - `409` - conflito (usuário já possui reserva/empréstimo ativo deste livro).

  ***

  Se quiser, posso adicionar exemplos curl para cada rota de reserva, proteger as rotas com JWT ou criar um endpoint administrativo para disparar o job manualmente.
