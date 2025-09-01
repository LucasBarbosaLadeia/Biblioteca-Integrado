import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import path from "path";

// Importar models e suas relações
import "./models";

// Importar rotas
import routes from "./routes";

const app = express();
const port = 3001; // Mudando para porta 3001 para evitar conflito

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar rotas da API
app.use("/api", routes);

// Testar conexão com banco de dados
const testDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Banco de dados conectado com sucesso!");

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log("🔄 Banco de dados sincronizado!");
  } catch (error) {
    console.error("❌ Erro no banco de dados:", error);
    process.exit(1);
  }
};

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    // Testar banco primeiro
    await testDatabase();

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📚 Biblioteca Integrado - Backend`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Rota de teste (mantida para compatibilidade)
app.get("/", (req, res) => {
  res.json({
    message: "Biblioteca Integrado API está funcionando!",
    api: "Acesse /api para ver os endpoints disponíveis",
  });
});

// Rota de health check (mantida para compatibilidade)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    timestamp: new Date().toISOString(),
  });
});

startServer();
