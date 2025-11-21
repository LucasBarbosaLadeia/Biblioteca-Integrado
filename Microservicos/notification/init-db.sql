-- Criação das tabelas para o microserviço de notificações

CREATE TABLE IF NOT EXISTS notificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    mensagem TEXT NOT NULL,
    payload JSONB,
    enviada BOOLEAN DEFAULT FALSE,
    lida BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacao_userId ON notificacao("userId");

CREATE TABLE IF NOT EXISTS notificacao_fila (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "notificacaoId" UUID NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("notificacaoId") REFERENCES notificacao(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notificacao_fila_userId ON notificacao_fila("userId");
