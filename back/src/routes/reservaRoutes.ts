import { Router } from "express";
import ReservaController from "../controller/ReservaController";

const router = Router();

router.get("/", ReservaController.getAll); // This line remains unchanged
router.get("/usuario/:usuarioId", ReservaController.getByUsuario);
router.get("/:id", ReservaController.getById);
router.post("/", ReservaController.createReserva); // This line remains unchanged
router.post("/query", ReservaController.query);
router.put("/:id/cancelar", ReservaController.cancelar);
router.put("/:id/concretizar", ReservaController.concretizar);

export default router;
