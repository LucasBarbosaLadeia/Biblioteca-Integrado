import { Router } from "express";
import { UsuarioController } from "../controller";

const router = Router();

// Rotas para Usuários
router.get("/", UsuarioController.getAll);
router.get("/:id", UsuarioController.getById);
router.get("/ra/:ra", UsuarioController.getByRA);
router.post("/", UsuarioController.create);
router.put("/:id", UsuarioController.update);
router.delete("/:id", UsuarioController.delete);
router.post("/login", UsuarioController.login);

export default router;
