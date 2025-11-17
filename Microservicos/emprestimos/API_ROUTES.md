# 📚 API Routes - Microserviço Empréstimos

Base URL (padrão em docker-compose):

```
http://localhost:3002
```

Todos os endpoints abaixo estão sob o caminho `/emprestimos` (ex.: `GET /emprestimos`).

| Método | Endpoint                    | Descrição                                                                            |
| ------ | --------------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/emprestimos`              | Listar todos os empréstimos                                                          |
| GET    | `/emprestimos/:id`          | Buscar empréstimo por ID                                                             |
| POST   | `/emprestimos`              | Criar novo empréstimo                                                                |
| PUT    | `/emprestimos/:id/devolver` | Marcar empréstimo como devolvido (registra data_devolucao_real e incrementa estoque) |
| GET    | `/emprestimos/estatisticas` | Retornar estatísticas (total, ativos, devolvidos, atrasados)                         |

---

Exemplos e formatos

- GET /emprestimos
  - Descrição: retorna a lista completa de empréstimos (sem paginação por enquanto).
  - Exemplo de resposta (200):

```json
[
  {
    "id": 1,
    "id_usuario": 1,
    "id_livro": 2,
    "data_emprestimo": "2025-11-15T12:34:56.000Z",
    "data_devolucao_prevista": "2025-12-15T00:00:00.000Z",
    "data_devolucao_real": null,
    "status": "ativo",
    "createdAt": "2025-11-15T12:34:56.000Z"
  },
  {
    /* ... */
  }
]
```

- GET /emprestimos/:id
  - Descrição: retorna um empréstimo específico por `id`.
  - Respostas:
    - 200: empréstimo encontrado (mesmo formato do item acima, objeto único).
    - 404: empréstimo não encontrado.

  - Exemplo (200):

```json
{
  "id": 1,
  "id_usuario": 1,
  "id_livro": 2,
  "data_emprestimo": "2025-11-15T12:34:56.000Z",
  "data_devolucao_prevista": "2025-12-15T00:00:00.000Z",
  "data_devolucao_real": null,
  "status": "ativo",
  "createdAt": "2025-11-15T12:34:56.000Z"
}
```

- POST /emprestimos
  - Descrição: cria um novo empréstimo.
  - Body (JSON):

```json
{
  "id_usuario": 1,
  "id_livro": 2,
  "data_devolucao_prevista": "2025-12-20T00:00:00.000Z"
}
```

- Possíveis respostas:
  - 201: empréstimo criado (retorna o objeto criado).
  - 400: dados inválidos (ex.: data_devolucao_prevista não é futura, livro indisponível, empréstimo ativo já existe).
  - 404: usuário ou livro não encontrado.

- Exemplo (201):

```json
{
  "id": 42,
  "id_usuario": 1,
  "id_livro": 2,
  "data_emprestimo": "2025-11-15T12:40:00.000Z",
  "data_devolucao_prevista": "2025-12-20T00:00:00.000Z",
  "data_devolucao_real": null,
  "status": "ativo",
  "createdAt": "2025-11-15T12:40:00.000Z"
}
```

- PUT /emprestimos/:id/devolver
  - Descrição: marca um empréstimo ativo como devolvido, registra `data_devolucao_real` e tenta incrementar o estoque do livro no backend.
  - Respostas:
    - 200: devolução bem-sucedida (retorna o empréstimo atualizado).
    - 400: empréstimo não está ativo (não pode devolver).
    - 404: empréstimo não encontrado.

  - Exemplo (200):

```json
{
  "id": 42,
  "id_usuario": 1,
  "id_livro": 2,
  "data_emprestimo": "2025-11-15T12:40:00.000Z",
  "data_devolucao_prevista": "2025-12-20T00:00:00.000Z",
  "data_devolucao_real": "2025-11-20T10:00:00.000Z",
  "status": "devolvido",
  "createdAt": "2025-11-15T12:40:00.000Z"
}
```

- GET /emprestimos/estatisticas
  - Descrição: retorna contagens simples sobre empréstimos.
  - Exemplo de resposta (200):

```json
{
  "total": 100,
  "ativos": 25,
  "devolvidos": 70,
  "atrasados": 5
}
```

---

Observações técnicas

- O microserviço usa TypeORM e espera que o backend principal (serviço `backend`) esteja acessível via a variável `BACKEND` (ex.: `http://backend:3001/api` no ambiente Docker). O serviço de empréstimos também faz chamadas ao backend para validar usuário/livro e para atualizar estoque/reservas.
- Erros lançados pelo serviço seguem a convenção NestJS (ex.: NotFoundException resulta em 404 com mensagem no body).
- O endpoint de listagem (`GET /emprestimos`) não possui paginação atualmente.

---

Como testar localmente (PowerShell)

```powershell
# Listar todos
Invoke-RestMethod -Uri http://localhost:3002/emprestimos -Method Get

# Criar empréstimo
Invoke-RestMethod -Uri http://localhost:3002/emprestimos -Method Post -ContentType 'application/json' -Body (@{ id_usuario = 1; id_livro = 2; data_devolucao_prevista = '2025-12-20T00:00:00.000Z' } | ConvertTo-Json)

# Devolver
Invoke-RestMethod -Uri http://localhost:3002/emprestimos/42/devolver -Method Put

# Estatísticas
Invoke-RestMethod -Uri http://localhost:3002/emprestimos/estatisticas -Method Get
```

Se quiser, eu atualizo o README do microserviço com essa documentação ou adiciono exemplos curl equivalentes.
