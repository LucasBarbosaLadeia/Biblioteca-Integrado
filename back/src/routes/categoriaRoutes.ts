import { Router } from "express";
import express from "express";
import { CategoriaController } from "../controller";

const router = Router();

// JSON parser para rotas que precisam processar body
const jsonParser = express.json();

// Rotas para Categorias
router.get("/", CategoriaController.getAll);
router.get("/:id", CategoriaController.getById);
router.get("/nome/:nome", CategoriaController.getByNome);
router.get("/:id/estatisticas", CategoriaController.getEstatisticas);
router.post("/", jsonParser, CategoriaController.create);
router.put("/:id", jsonParser, CategoriaController.update);
router.delete("/:id", CategoriaController.delete);

export default router;
