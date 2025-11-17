import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import path from "path";

// Importar models e suas relações
import "./models";

// Importar rotas
import routes from "./routes";
import { expireReservations } from "./jobs/expireReservations";

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // pegar da env quando disponível

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

    // Sincronizar modelos (aplica alterações necessárias ao schema)
    await sequelize.sync({ alter: true });
    console.log("🔄 Banco de dados sincronizado (alter applied)!");
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
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📚 Biblioteca Integrado - Backend`);
    });

    // Agendador simples para expirar reservas (opcional via env)
    const enableJob = process.env.ENABLE_RESERVAS_JOB === "true";
    if (enableJob) {
      const minutes = process.env.RESERVAS_JOB_INTERVAL_MINUTES
        ? Number(process.env.RESERVAS_JOB_INTERVAL_MINUTES)
        : 5;
      console.log(
        `🕒 Job de expiração de reservas ativado: rodando a cada ${minutes} minutos`
      );
      // executar imediatamente e depois em intervalos
      (async () => {
        try {
          const r = await expireReservations();
          console.log(`Job expiracao: ${r.expired} reservas expiradas`);
        } catch (e) {
          console.error("Erro no job expiracao:", e);
        }
      })();

      setInterval(async () => {
        try {
          const r = await expireReservations();
          if (r.expired > 0)
            console.log(`Job expiracao: ${r.expired} reservas expiradas`);
        } catch (e) {
          console.error("Erro no job expiracao:", e);
        }
      }, minutes * 60 * 1000);
    }
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
