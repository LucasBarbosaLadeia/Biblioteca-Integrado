## Evidências e Justificativas - Tech Forge

### 1. Gestão do Trabalho e Progresso via Jira

Utilizei o Jira para organizar todas as tarefas do projeto Biblioteca Integrado. Cada funcionalidade (login, busca, favoritos, notificações) foi registrada como uma issue, com subtarefas detalhadas. As tarefas foram atribuídas conforme as responsabilidades e o status foi atualizado em tempo real, permitindo acompanhamento do progresso e identificação rápida de bloqueios. O uso do Jira garantiu transparência e colaboração eficiente entre os membros da equipe.

### 2. Análise do Contexto do Projeto com Cynefin e Escolha da Abordagem

Classifiquei o projeto como “Complicado” no Framework Cynefin, pois envolve integração entre front-end e back-end, requisitos definidos e uso de tecnologias conhecidas. Por isso, optei por uma abordagem ágil, utilizando Scrum, para permitir entregas incrementais, adaptação rápida a mudanças e maior colaboração. O Product Backlog foi priorizado e revisado a cada sprint.

### 3. Planejamento e Condução do Ciclo de Vida do Projeto

Elaborei um Product Backlog detalhado, com User Stories para cada funcionalidade, incluindo critérios de aceite claros (ex: “Usuário deve conseguir logar com RA e senha válidos”). As histórias foram priorizadas conforme o valor para o usuário e complexidade técnica. Realizei sprints semanais, revisando o progresso e ajustando o planejamento conforme necessário. A implementação foi incremental, com versões parciais entregues para testes e validação.

---

**Dicas para nota máxima:**

- Junte evidências: prints do Jira, backlog, user stories, canvas, reuniões/sprints.
- Seja claro e objetivo nas justificativas.
- Mostre que você entende e aplicou os conceitos de gestão de projetos.

# Biblioteca Integrado

Sistema de gerenciamento de biblioteca universitária, desenvolvido para facilitar o acesso, busca, empréstimo e organização de livros para alunos e funcionários.

## Funcionalidades

- Autenticação de usuário (login)
- Busca de livros por nome, autor ou categoria
- Visualização de detalhes dos livros
- Favoritar livros
- Notificações personalizadas
- Alertas customizados para funcionalidades em desenvolvimento
- Interface responsiva para dispositivos móveis

## Como rodar o projeto

### Pré-requisitos

- Node.js
- Expo CLI (para o front-end)
- Banco de dados configurado (ver instruções do back-end)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/LucasBarbosaLadeia/Biblioteca-Integrado.git
   ```
2. Instale as dependências do back-end:
   ```bash
   cd back
   npm install
   ```
3. Instale as dependências do front-end:
   ```bash
   cd ../Front-End/Biblioteca-Integrado
   npm install
   ```

### Executando o projeto

- Para iniciar o back-end:
  ```bash
  npm run dev
  ```
- Para iniciar o front-end:
  ```bash
  npm start
  ```

## Tecnologias utilizadas

- React Native (Expo)
- Node.js
- Express
- AsyncStorage
- Styled Components
- API REST

## Estrutura de pastas

```
Biblioteca-Integrado/
├── back/                # Back-end (API, modelos, rotas)
├── Front-End/
│   └── Biblioteca-Integrado/  # Front-end mobile
│       ├── src/
│       │   ├── components/    # Componentes reutilizáveis
│       │   ├── screens/       # Telas principais
│       │   ├── navigation/    # Navegação
│       │   ├── utils/         # Funções utilitárias
│       │   └── assets/        # Imagens e ícones
│       └── ...
└── README.md           # Documentação principal
```

## Exemplos de telas

Adicione screenshots das principais telas aqui para facilitar a visualização do sistema.

## Autores

- Lucas Barbosa Ladeia
- Gabriel Henrique Sanches Speciam
- Colaboradores: (Maycon)

## Licença

Este projeto é acadêmico e não possui licença de uso comercial.

## Roadmap

- Integração completa com sistema da empresa
- Implementação de notificações push
- Melhorias na interface e acessibilidade
- Testes automatizados

---

Para dúvidas, sugestões ou contribuições, abra uma issue ou entre em contato!
