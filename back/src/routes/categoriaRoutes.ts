import { Router } from "express";
import { CategoriaController } from "../controller";
import { authMiddleware, isLibrarian } from "../middleware/auth";

const router = Router();

// Rotas GET - Públicas (qualquer um pode ver categorias)
router.get("/", CategoriaController.getAll);
router.get("/:id", CategoriaController.getById);
router.get("/nome/:nome", CategoriaController.getByNome);
router.get("/:id/estatisticas", CategoriaController.getEstatisticas);

// Rotas POST/PUT/DELETE - Protegidas (apenas bibliotecários e admins)
router.post("/", authMiddleware, isLibrarian, CategoriaController.create);

router.put("/:id", authMiddleware, isLibrarian, CategoriaController.update);

router.delete("/:id", authMiddleware, isLibrarian, CategoriaController.delete);

export default router;
