import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import livroRoutes from "./livroRoutes";
import categoriaRoutes from "./categoriaRoutes";
import favoritoRoutes from "./favoritoRoutes";

const router = Router();

// Rotas principais da API
router.use("/usuarios", usuarioRoutes);
router.use("/livros", livroRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/favoritos", favoritoRoutes);
// REMOVIDO - Empréstimos e Reservas agora estão no microserviço (porta 3002)

// Rota de health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API da Biblioteca Integrado está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bem-vindo à API da Biblioteca Integrado!",
    version: "1.0.0",
    endpoints: {
      usuarios: "/usuarios",
      livros: "/livros",
      categorias: "/categorias",
      favoritos: "/favoritos",
      emprestimos: "Microserviço de Empréstimos (porta 3002)",
      reservas: "Microserviço de Empréstimos (porta 3002)",
      notificacoes: "Microserviço de Notificações (porta 3005)",
      health: "/health",
    },
  });
});

export default router;
