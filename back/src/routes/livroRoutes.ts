import { Router } from "express";
import { LivroController } from "../controller";

const router = Router();

// Rotas para Livros
router.get("/recentes", LivroController.getRecentes);
router.get("/", LivroController.getAll);
router.get("/disponiveis", LivroController.getDisponiveis);
router.get("/recomendados", LivroController.getRecomendados);
router.get("/categoria/:categoriaId", LivroController.getByCategoria);
router.get("/:id", LivroController.getById);
router.post("/", LivroController.create);
router.put("/:id", LivroController.update);
router.delete("/:id", LivroController.delete);
router.patch("/:id/quantidade", LivroController.updateQuantidade);

export default router;
