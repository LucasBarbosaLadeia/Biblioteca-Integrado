import { Router } from "express";
import { LivroController } from "../controller";
import upload from "../config/multer";
import { authMiddleware, isLibrarian } from "../middleware/auth";

const router = Router();

// Rotas GET - Públicas (qualquer um pode ver os livros)
router.get("/recentes", LivroController.getRecentes);
router.get("/", LivroController.getAll);
router.get("/disponiveis", LivroController.getDisponiveis);
router.get("/recomendados", LivroController.getRecomendados);
router.get("/categoria/:categoriaId", LivroController.getByCategoria);
router.get("/:id", LivroController.getById);

// Rotas POST/PUT/DELETE - Protegidas (apenas bibliotecários e admins)
// Criar livro (com upload de imagem)
router.post(
  "/",
  authMiddleware,
  isLibrarian,
  upload.single("capa"),
  LivroController.create
);

// Atualizar livro (com upload opcional de imagem)
router.put(
  "/:id",
  authMiddleware,
  isLibrarian,
  upload.single("capa"),
  LivroController.update
);

// Deletar livro
router.delete("/:id", authMiddleware, isLibrarian, LivroController.delete);

// Decrementar quantidade (quando empresta livro) - Protegido
router.patch(
  "/:id/decrementar",
  authMiddleware,
  isLibrarian,
  LivroController.decrementar
);

// Incrementar quantidade (quando devolve livro) - Protegido
router.patch(
  "/:id/incrementar",
  authMiddleware,
  isLibrarian,
  LivroController.incrementar
);

export default router;
