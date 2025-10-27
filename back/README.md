# Backend - Biblioteca Integrado

Este README explica os comandos básicos para desenvolver e rodar o backend do projeto `Biblioteca-Integrado`.

Localização: `back/`

## Pré-requisitos

- Node.js (recomendado >= 18)
- npm
- MySQL (local) OU Docker/Docker Compose (recomendado se não tiver MySQL local)

## Variáveis de ambiente

O backend lê as variáveis de ambiente para a conexão com o banco de dados (arquivo `.env` opcional):

- DB_HOST (padrão: localhost)
- DB_PORT (padrão: 3306)
- DB_USER (padrão: root)
- DB_PASSWORD (padrão: "")
- DB_NAME (padrão: biblioteca)
- PORT (padrão: 3001)

Exemplo de `.env` (opcional, na pasta `back/`):

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=biblioteca
PORT=3001

> O código já carrega `dotenv` e usa valores de fallback caso as variáveis não estejam definidas.

## Comandos básicos (PowerShell)

1. Ir para a pasta do backend:

```powershell
cd 'C:\7Semestre TADS\Biblioteca-Integrado\back'
```

2. Instalar dependências:

```powershell
npm install
```

3. Rodar em modo desenvolvimento (hot reload):

```powershell
npm run dev
```

4. Compilar e rodar em produção:

```powershell
npm run build
npm start
```

5. Definir porta temporariamente (PowerShell) e executar:

```powershell
$env:PORT=4000; npm run dev
```

## Usando Docker Compose

O repositório possui um `Docker-compose.yml` na raiz que define serviços `database`, `backend` e `nginx`. Exemplos:

- Subir apenas o banco MySQL:

```powershell
cd 'C:\7Semestre TADS\Biblioteca-Integrado'
docker-compose up -d database
```

- Subir todos os serviços (build + background):

```powershell
cd 'C:\7Semestre TADS\Biblioteca-Integrado'
docker-compose up --build -d
```

Observações sobre portas/env no `docker-compose.yml`:

- O `docker-compose.yml` atual mapeia a porta do backend como `"8080:8080"`, mas o Dockerfile do backend expõe `3000` e o código usa por padrão `3001`.
- Para garantir que o container backend leia a porta corretamente, você pode (1) definir `PORT=8080` nas env do serviço `backend` no `docker-compose.yml` ou (2) alterar o mapeamento para `"3001:3001"`.

Se quiser, altere o `docker-compose.yml` para adicionar `- PORT=8080` no bloco `environment` do serviço `backend`.

## Banco de dados

- Se usar o serviço `database` do `docker-compose`, ele já cria o banco `biblioteca` (variáveis no compose: `MYSQL_DATABASE=biblioteca`, `MYSQL_USER=app`, `MYSQL_PASSWORD=1234`).
- Se usar MySQL local, crie a base manualmente:

```sql
CREATE DATABASE biblioteca;
```

## Troubleshooting (erros comuns)

- Erro de conexão com o banco:

  - Verifique se o MySQL está rodando e aceitando conexões na `host` e `port` configuradas.
  - Confira `DB_USER`/`DB_PASSWORD`/`DB_NAME`.
  - Se backend e DB estiverem em containers separados no mesmo compose, use `DB_HOST=database` (nome do serviço).

- Porta em uso / servidor não inicia:

  - Altere `PORT` com: `$env:PORT=4000; npm run dev` (PowerShell) ou export/defina no `.env`.

- Migrations/Sync:
  - O projeto usa `sequelize.sync()` no startup — isso sincroniza os modelos com o banco. Se preferir controlar manualmente, remova ou ajuste esse comportamento.

## Endpoints úteis

- Rota raiz de teste: `GET /` retorna uma mensagem JSON.
- Healthcheck: `GET /health`.
- API principal: prefixo `/api` (veja `back/src/routes`).

## Arquivos importantes

- `back/package.json` — scripts e dependências.
- `back/src/index.ts` — ponto de entrada (lê PORT e inicializa o servidor).
- `back/src/config/database.ts` — configuração do Sequelize (lê `DB_*` via dotenv).
- `Docker-compose.yml` — orquestra serviços (na raiz do projeto).

Se quiser, eu posso:

- ajustar o `docker-compose.yml` para definir `PORT=8080` no serviço `backend` (mantendo o mapeamento atual), ou
- alterar o mapeamento para `3001:3001`.

---

Arquivo criado/atualizado automaticamente para facilitar o desenvolvimento.
