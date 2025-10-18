# Biblioteca-Integrado (Front-End)

Este README traz comandos úteis para desenvolver e rodar o front-end da aplicação (projeto Expo).

## Requisitos

- Node.js (recomendado v18+)
- npm
- Conexão à internet para instalar dependências

## Instalação

Abra um terminal (PowerShell) dentro da pasta do front:

```powershell
cd "C:\7Semestre TADS\Biblioteca-Integrado\Front-End\Biblioteca-Integrado"
npm install
```

## Rodar no navegador (modo web)

Inicie o servidor web do Expo:

```powershell
npm run web
```

Isso deve abrir o Expo DevTools e a versão web da aplicação em `http://localhost:19006` (porta pode variar).

## Acessar por outro dispositivo na mesma rede (LAN)

1. Descubra o IP local do seu computador:

```powershell
ipconfig | Select-String "IPv4"
```

2. Inicie o Expo escutando em todas as interfaces (aceita conexões externas):

```powershell
npx expo start --web --host 0.0.0.0
```

3. No outro dispositivo, abra no navegador:

```
http://<SEU_IP_LOCAL>:19006
```

Substitua `<SEU_IP_LOCAL>` pelo IP obtido no passo 1. Use a porta exibida no terminal caso seja diferente.

## Problemas comuns

- Erro de dependências (ERESOLVE): atualize as versões de `react`/`react-dom` conforme indicado e rode `npm install` novamente. Em último caso, usar `npm install --legacy-peer-deps`.
- Firewall: permita conexões do Node/Expo ou autorize a porta mostrada (ex.: 19006) nas configurações do Firewall do Windows.
- Porta ocupada: se a porta padrão estiver em uso, o Expo sugerirá outra porta. Use a porta indicada no terminal.
- Bibliotecas nativas não suportadas na web: alguns pacotes React Native não funcionam no navegador. Verifique erros no console e substitua por alternativas web-friendly ou condicione o uso por plataforma.

## Comandos úteis (git)

```powershell
# adicionar e commitar alterações
git add package.json README.md
git commit -m "Docs: add front README with web/run instructions"
```

## Observações

- Os scripts `start`, `android`, `ios` e `web` estão definidos no `package.json`.
- Se preferir, use `npx expo start --tunnel` (ou escolha Tunnel no DevTools) para acessar através de internet sem configurar LAN.

---

Se quiser, eu posso também commitar este README e abrir um PR. Quer que eu faça isso agora?
