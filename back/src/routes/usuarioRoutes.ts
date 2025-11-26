import { Router } from "express";
import express from "express";
import { UsuarioController } from "../controller";

const router = Router();

// JSON parser para todas as rotas de usuário
const jsonParser = express.json();

// Rotas para Usuários
router.get("/", UsuarioController.getAll);
router.get("/:id", UsuarioController.getById);
router.get("/ra/:ra", UsuarioController.getByRA);
router.post("/", jsonParser, UsuarioController.create);
router.put("/:id", jsonParser, UsuarioController.update);
router.delete("/:id", UsuarioController.delete);
router.post("/login", jsonParser, UsuarioController.login);

export default router;
