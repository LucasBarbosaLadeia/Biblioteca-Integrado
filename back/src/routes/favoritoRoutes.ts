import { Router } from "express";
import express from "express";
import { FavoritoController } from "../controller";

const router = Router();

// JSON parser para rotas que precisam processar body
const jsonParser = express.json();

// Rotas para Favoritos
router.get("/", FavoritoController.getAll);
router.get("/usuario/:usuarioId", FavoritoController.getByUsuario);
router.get("/livro/:livroId", FavoritoController.getByLivro);
router.get("/usuario/:usuarioId/livro/:livroId", FavoritoController.isFavorito);
router.get("/estatisticas", FavoritoController.getEstatisticas);
router.get("/:id", FavoritoController.getById);
router.post("/", jsonParser, FavoritoController.create);
router.post("/toggle", jsonParser, FavoritoController.toggle);
router.delete("/:id", FavoritoController.delete);
router.delete(
  "/usuario/:usuarioId/livro/:livroId",
  FavoritoController.removeByUsuarioLivro
);

export default router;
