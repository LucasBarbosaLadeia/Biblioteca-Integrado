import { Router } from "express";
import { CategoriaController } from "../controller";

const router = Router();

// Rotas para Categorias
router.get("/", CategoriaController.getAll);
router.get("/:id", CategoriaController.getById);
router.get("/nome/:nome", CategoriaController.getByNome);
router.get("/:id/estatisticas", CategoriaController.getEstatisticas);
router.post("/", CategoriaController.create);
router.put("/:id", CategoriaController.update);
router.delete("/:id", CategoriaController.delete);

export default router;
