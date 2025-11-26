import { Router } from "express";
import express from "express";
import { LivroController } from "../controller";
import upload from "../config/multer";

const router = Router();

// Middleware para rotas que NÃO usam upload (precisam de JSON parser)
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: true });

// Rotas GET (precisam de JSON parser para query params complexos, se houver)
router.get("/recentes", LivroController.getRecentes);
router.get("/", LivroController.getAll);
router.get("/disponiveis", LivroController.getDisponiveis);
router.get("/recomendados", LivroController.getRecomendados);
router.get("/categoria/:categoriaId", LivroController.getByCategoria);
router.get("/:id", LivroController.getById);

// Rotas POST/PUT com upload (NÃO usar JSON parser, Multer processa tudo)
router.post("/", upload.single("capa"), LivroController.create);
router.put("/:id", upload.single("capa"), LivroController.update);

// Rotas sem upload (usar JSON parser)
router.delete("/:id", jsonParser, LivroController.delete);
router.patch("/:id/decrementar", jsonParser, LivroController.decrementar);
router.patch("/:id/incrementar", jsonParser, LivroController.incrementar);

export default router;
