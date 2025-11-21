import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import livroRoutes from "./livroRoutes";
import categoriaRoutes from "./categoriaRoutes";
import emprestimoRoutes from "./emprestimoRoutes";
import favoritoRoutes from "./favoritoRoutes";

const router = Router();

// Rotas principais da API
router.use("/usuarios", usuarioRoutes);
router.use("/livros", livroRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/emprestimos", emprestimoRoutes);
router.use("/favoritos", favoritoRoutes);
// router.use("/reservas", reservaRoutes); // REMOVIDO - Reservas agora estão no microserviço de empréstimos

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
      emprestimos: "/emprestimos",
      favoritos: "/favoritos",
      reservas: "Microserviço de Empréstimos (porta 3002)",
      health: "/health",
    },
  });
});

export default router;
