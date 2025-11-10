# Detailed Analysis (Análise Detalhada) — Back-end API contract

Este documento descreve as rotas e o formato dos dados que o back-end deve fornecer para que a tela `DetailedAnalysis` (admin) funcione corretamente.

Local do arquivo de front-end: `src/screens/admin/DetailedAnalysis.jsx`

## Endpoint principal usado pela tela

- GET /analytics

  - Descrição: endpoint único que retorna os dados agregados necessários para popular a tela de Análise Detalhada (tendência mensal, horários de pico, performance por categoria e insights).
  - URL de teste (front-end espera por padrão): `http://localhost:3000/analytics`
  - Código de sucesso: 200
  - Observações: se o endpoint não existir, a tela usa dados de fallback estáticos embutidos no front-end. Porém, recomenda-se implementar esse endpoint para dados reais.

## Formato de resposta esperado (JSON)

Exemplo completo:

{
"monthly": [
{ "label": "Jan", "value": 20 },
{ "label": "Fev", "value": 24 },
{ "label": "Mar", "value": 26 },
{ "label": "Abr", "value": 30 },
{ "label": "Mai", "value": 34 },
{ "label": "Jun", "value": 28 }
],
"categories": [
{ "name": "Programação", "total": 3, "lent": 3, "available": 0 },
{ "name": "Ficção", "total": 5, "lent": 2, "available": 3 }
],
"insights": [
{ "title": "Crescimento de 15%", "subtitle": "Empréstimos aumentaram em relação ao mês anterior" },
{ "title": "Pico às 10h-12h", "subtitle": "Período de maior movimentação" }
]
}

Campo por campo

- monthly: array de { label: string, value: number }

  - label: texto curto (ex.: 'Jan', 'Fev', 'Mar') exibido no eixo/linha
  - value: número de empréstimos (ou métrica) no período

- peakHours: array de { label: string, count: number }

  - label: intervalo horário (ex.: '10h-12h')
  - count: número de eventos/empréstimos naquele período

- categories: array de { name: string, total: number, lent: number, available: number }
  - name: nome da categoria
  - total: total de títulos registrados nessa categoria (opcional, mas recomendado)
  - lent: quantos estão emprestados
  - available: quantos estão disponíveis

-- insights: array de objetos curtos com os dados necessários para exibir uma mensagem/alerta no painel lateral.

- Schema mínimo recomendado (muitos back-ends podem enviar apenas isso):
  - { title: string, subtitle?: string }
- Campos opcionais (úteis, mas não obrigatórios): { emoji?: string, color?: string }
- Observação: o front-end atual aceita tanto o formato completo quanto o minimalista — ele usa valores padrões para emoji e cor quando esses campos não são fornecidos.
- insights são mensagens destacadas que aparecerão no painel lateral (podem ser geradas por regras do back-end)

## Recomendações de implementação no back-end

- Forneça este endpoint agregado (`/analytics`) para reduzir chamadas do cliente. O endpoint pode compor dados de vários serviços (usuarios, livros, emprestimos, favoritos).
- Retorne 200 com o JSON acima. Em caso de erro, retornar 500 com um objeto { message: '...' }.
- Habilite CORS (origem do front-end) se front e back estiverem em domínios/portas diferentes.

Query params (opcionais)

- `start` e `end` (ISO date): limitar o intervalo para tendências e horários de pico.

Exemplo de implementação (pseudo-steps)

1. monthly: agregue empréstimos por mês (COUNT) e retorne os 6-12 últimos meses.
2. peakHours: agrupe por faixa horária (ex.: 8-10,10-12, etc.) usando horário do empréstimo.
3. categories: para cada categoria conte total, contagem de emprestados e disponíveis (total - emprestados pode ser calculado se necessário).
4. insights: regras simples (crescimento > X%, categoria com taxa de utilização alta, horário com pico) e retorne uma lista de mensagens.

## Testes com PowerShell / curl

Testar o endpoint com PowerShell (Windows):

```powershell
curl -s -X GET "http://localhost:3000/analytics" -H "Accept: application/json" | ConvertFrom-Json
```

Exemplo de resposta (esperado): veja o JSON de exemplo acima.

## Fallback no front-end

Se o endpoint estiver indisponível, a tela `DetailedAnalysis` usa um dataset de fallback (interno) para continuar funcionando — mas os dados não serão reais.

Outros endpoints úteis no projeto (já usados por outras telas do admin)

- GET /api/usuarios?page=1&limit=1000 — lista de usuários (usado para métricas de total/alunos/funcionários)
- GET /api/livros?page=1&limit=1 — usado para obter `pagination.total` do total de livros
- GET /api/livros/disponiveis?page=1&limit=1 — usado para obter total de livros disponíveis
- GET /api/emprestimos/estatisticas — estatísticas gerais de empréstimos
- GET /api/favoritos/estatisticas — estatísticas / top livros favoritados

Se precisar, posso gerar exemplos de consultas SQL (Postgres/MySQL) para cada agregado acima — quer que eu gere isso também?

---

Arquivo criado automaticamente para ajudar a integração front ↔ back. Se o seu back já tiver endpoints com outros nomes, me passe as rotas e adapto o front-end para apontar para elas.
