# Requisitos de API para as telas Admin (frontend)

Este arquivo lista os endpoints que o frontend administrativo (telas em `Front-End/Biblioteca-Integrado/src/screens/admin`) espera do backend. Envie este arquivo para a pessoa que está modificando o backend.

## Resumo rápido

- Rota base da API: `/api` (conforme `back/src/routes/index.ts`).
- Módulos importantes já existentes no backend: `usuarios`, `livros`, `categorias`, `emprestimos`, `favoritos`.
- Endpoint explicitamente faltante usado pelo frontend: `GET /api/analytics` (veja seção dedicada abaixo).

---

## Endpoints exigidos (mínimo para admin funcionar)

Para cada endpoint abaixo indico: método — rota — finalidade — observações de request/response.

### Usuários

- GET /api/usuarios?page={page}&limit={limit}

  - Finalidade: listar usuários (dashboard soma total / breakdown por tipo `tipo` = "aluno" | "funcionario").
  - Observações: suportar página e limite; resposta pode ser array `data` ou um objeto com `pagination.total`.

- GET /api/usuarios/:id

  - Finalidade: obter detalhes de um usuário.

- POST /api/usuarios

  - Finalidade: criar usuário.
  - Body: { nome, ra, tipo, senha, ... }

- PUT /api/usuarios/:id

  - Finalidade: atualizar usuário.

- DELETE /api/usuarios/:id

  - Finalidade: excluir usuário.

- POST /api/usuarios/login
  - Finalidade: autenticação (se o app usa login via backend).

---

### Livros

- GET /api/livros?page={page}&limit={limit}&search={search}&categoria={categoriaId}

  - Finalidade: listagem/pesquisa/paginação dos livros (ManageBooks usa `search` e `categoria`).
  - Observações: `search` deve buscar por título/autor/isbn; `categoria` filtrar por id_categoria; retorno esperado: { data: [...], pagination: { total, page, limit } } ou similar.

- GET /api/livros/disponiveis?page={page}&limit={limit}

  - Finalidade: contar/listar livros com cópias disponíveis (usado no dashboard para contar `available`).

- GET /api/livros/recentes

  - Finalidade: lista de livros recentes (rota já existe no backend).

- GET /api/livros/:id

  - Finalidade: obter dados completos do livro para edição (EditBook.jsx espera campos como `id_livro` ou `id`, `titulo`, `autor`, `qt_total`, `qt_atual`, `id_categoria`, `capa_url`, `sinopse`, `ano_publicacao`, `editora`, `paginas`, `prateleira`).

- POST /api/livros

  - Finalidade: criar livro.
  - Body: ver campos acima.

- PUT /api/livros/:id

  - Finalidade: atualizar livro (EditBook usa PUT).

- DELETE /api/livros/:id

  - Finalidade: excluir livro (ManageBooks usa DELETE).

- PATCH /api/livros/:id/quantidade (ou PUT)
  - Finalidade: atualizar estoque/quantidade de um livro (rota já presente: `router.patch('/:id/quantidade')`).

---

### Categorias

- GET /api/categorias

  - Finalidade: popular selects de categoria (EditBook, ManageBooks).

- GET /api/categorias/:id
- GET /api/categorias/nome/:nome
- GET /api/categorias/:id/estatisticas

  - Finalidade: estatísticas por categoria (rota existe conforme `categoriaRoutes.ts`).

- POST /api/categorias, PUT /api/categorias/:id, DELETE /api/categorias/:id
  - Finalidade: CRUD de categorias.

---

### Empréstimos

- GET /api/emprestimos/estatisticas

  - Finalidade: estatísticas gerais de empréstimos (HomeAdmin consome este endpoint e espera campos como `emprestimosAtivos`, `emprestimosAtrasados`, `totalEmprestimos`, `emprestimosDevolvidos`).
  - Existe: sim (`emprestimoRoutes.ts`). Garantir formato consistente.

- GET /api/emprestimos, /ativos, /atrasados, /usuario/:usuarioId
- GET /api/emprestimos/:id
- POST /api/emprestimos
- PUT /api/emprestimos/:id/devolver
- PUT /api/emprestimos/:id/renovar
- DELETE /api/emprestimos/:id

---

### Favoritos

- GET /api/favoritos/estatisticas

  - Finalidade: retornar livros mais favoritados (HomeAdmin espera `livrosMaisFavoritados` ou similar).
  - Existe: sim em `favoritoRoutes.ts`.

- GET /api/favoritos, /usuario/:usuarioId, /livro/:livroId, /usuario/:usuarioId/livro/:livroId
- POST /api/favoritos
- POST /api/favoritos/toggle
- DELETE /api/favoritos/:id
- DELETE /api/favoritos/usuario/:usuarioId/livro/:livroId

---

### Health & Root

- GET /api/health — já existe
- GET /api/ — já existe e lista endpoints principais

---

## Endpoint faltante e recomendação

- Faltante: GET /api/analytics
  - Contexto: `Front-End/.../DetailedAnalysis.jsx` chama `api.get('analytics')`. Não há rota `analytics` nas rotas atuais.
  - Recomendo implementar um endpoint agregador no backend que retorne um JSON com o formato esperado pelo componente. Exemplo de shape sugerido:

```json
{
  "monthly": [ { "label": "Jan", "value": 20 }, ... ],
  "categories": [ { "name": "Ficção", "total": 5, "lent": 2, "available": 3 }, ... ],
  "insights": [ { "emoji": "📈", "title": "Crescimento", "subtitle": "Empréstimos +15%", "color": "#0ea5ad" }, ... ]
}
```

- Como compor os dados no backend: agregue dados de `EmprestimoController.getEstatisticas`, `FavoritoController.getEstatisticas`, `LivroController.getDisponiveis` e `CategoriaController.getEstatisticas`. Enviar já o `monthly` e `categories` para evitar lógica de agregação no cliente.

- Alternativa: modificar o frontend para buscar endpoints separados e compor os dados do lado do cliente (menos recomendável).

---

## Observações técnicas e de contrato (sugestões para o backend)

1. Paginação: padronizar retorno com `data` array e `pagination: { total, page, limit }` para facilitar contagens no front (HomeAdmin espera `pagination.total` em algumas chamadas).
2. Busca: `livros` deve aceitar `search` (string) e `categoria` (id) como query params.
3. Nomes de campos: preferir consistência — usar `id` ou `id_livro` consistentemente. O frontend já faz alguma normalização, mas padronizar reduz bugs.
4. Autorização: rotas de criação/atualização/exclusão devem exigir autenticação/roles (admin/bibliotecario). Se implementar, documentar header esperado (ex.: `Authorization: Bearer <token>`).
5. Erros: retornar JSON com `{ message: string, code?: string }` e status HTTP apropriado para que o frontend mostre mensagens corretas.

---

## Exemplos de testes rápidos (p/ dev backend usar curl / Postman)

- Checar listagem de livros (com busca e paginação):
  - GET /api/livros?page=1&limit=20&search=algoritmos&categoria=3
- Checar livro único:
  - GET /api/livros/12
- Checar estatísticas de empréstimo:
  - GET /api/emprestimos/estatisticas
- Checar endpoint sugerido de analytics (deve existir quando implementado):
  - GET /api/analytics

---

## Arquivos de rota onde procurar/alterar (backend)

- `back/src/routes/index.ts` (registro de sub-rotas e health)
- `back/src/routes/usuarioRoutes.ts`
- `back/src/routes/livroRoutes.ts`
- `back/src/routes/categoriaRoutes.ts`
- `back/src/routes/emprestimoRoutes.ts`
- `back/src/routes/favoritoRoutes.ts`

Se for criar `analytics`, sugiro: `back/src/routes/analyticsRoutes.ts` e um controller `AnalyticsController` em `back/src/controller` que invoque other controllers/services.

---

## Critérios mínimos de aceite para o admin funcionar

- [ ] `/api/livros` aceita `search` e `categoria` e retorna `pagination.total`.
- [ ] `/api/livros/:id` retorna todos os campos usados pelo frontend para edição.
- [ ] `/api/categorias` retorna lista para selects.
- [ ] `/api/emprestimos/estatisticas` e `/api/favoritos/estatisticas` retornam campos documentados pelo frontend (ou, se diferente, compartilhar o schema para ajustar o front).
- [ ] Implementar `/api/analytics` (ou comunicar ao frontend que foi alterado) para `DetailedAnalysis.jsx`.

---

Se quiser, posso gerar um `analyticsRoutes.ts` e um `AnalyticsController.ts` com um handler inicial (mock/aggregation) que o colega do backend pode integrar em sua implementação. Diga se quer que eu crie esses arquivos de exemplo.
