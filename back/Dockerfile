FROM node:22-slim

WORKDIR /app

# Instala dependências básicas e netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copia arquivos
COPY package.json tsconfig.json wait-for-db.sh ./
COPY src ./src

RUN chmod +x wait-for-db.sh

RUN npm install

EXPOSE 3001

CMD ["sh", "./wait-for-db.sh", "database", "npm", "run", "dev"]
