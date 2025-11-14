import { Request, Response } from "express";
import Reserva from "../models/Reserva";
import Usuario from "../models/Usuario";
import Livro from "../models/Livro";
import sequelize from "../config/database";
import { Op } from "sequelize";
import { DateTime } from "luxon";
import { notifyLowStock } from "../utils/notify";

const TIMEZONE = process.env.TIMEZONE || "America/Sao_Paulo";

function parseToUTC(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const s = String(value);
  // se a string já tem offset/Z, preserve o offset ao parsear
  // DateTime.fromISO com setZone true respeita o offset quando presente
  try {
    const dt = DateTime.fromISO(s, { setZone: true });
    if (dt.isValid) return dt.toUTC().toJSDate();
  } catch (e) {
    // fallback
  }
  // caso sem offset, interpretar como horário em TIMEZONE e converter para UTC
  const dtLocal = DateTime.fromISO(s, { zone: TIMEZONE });
  if (dtLocal.isValid) return dtLocal.toUTC().toJSDate();
  // último recurso: Date parse
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatToTimezone(value: any): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return null;
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone(TIMEZONE)
    .toISO({ suppressMilliseconds: true, includeOffset: true });
}

function formatReservaObject(obj: any) {
  if (!obj) return obj;
  const r = { ...obj };
  r.data_reserva = formatToTimezone(obj.data_reserva);
  r.data_expiracao = formatToTimezone(obj.data_expiracao);
  if (obj.createdAt) r.createdAt = formatToTimezone(obj.createdAt);
  if (obj.updatedAt) r.updatedAt = formatToTimezone(obj.updatedAt);
  return r;
}

export class ReservaController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await Reserva.findAndCountAll({
        order: [["data_reserva", "DESC"]],
        limit: Number(limit),
        offset,
      });

      const formatted = rows.map((r) => formatReservaObject(r.toJSON()));

      res.status(200).json({
        success: true,
        data: formatted,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Reservas listadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar reservas:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async query(req: Request, res: Response): Promise<void> {
    try {
      // aceitar filtros no corpo; se não houver corpo, aceitar query params
      const source: any = Object.keys(req.body || {}).length
        ? req.body
        : req.query;
      const {
        page = 1,
        limit = 10,
        id_usuario,
        id_livro,
        status,
        data_reserva_from,
        data_reserva_to,
      } = source;

      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (id_usuario) where.id_usuario = id_usuario;
      if (id_livro) where.id_livro = id_livro;
      if (status) where.status = status;
      if (data_reserva_from || data_reserva_to) {
        where.data_reserva = {};
        if (data_reserva_from)
          where.data_reserva[Op.gte] = parseToUTC(data_reserva_from);
        if (data_reserva_to)
          where.data_reserva[Op.lte] = parseToUTC(data_reserva_to);
      }

      const { count, rows } = await Reserva.findAndCountAll({
        where,
        order: [["data_reserva", "DESC"]],
        limit: Number(limit),
        offset,
      });

      const formatted = rows.map((r) => formatReservaObject(r.toJSON()));

      res.status(200).json({
        success: true,
        data: formatted,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Reservas listadas com sucesso (via POST)",
      });
    } catch (error) {
      console.error("Erro ao consultar reservas via POST:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        res
          .status(404)
          .json({ success: false, message: "Reserva não encontrada" });
        return;
      }
      res
        .status(200)
        .json({
          success: true,
          data: formatReservaObject(reserva.toJSON()),
          message: "Reserva encontrada",
        });
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async getByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await Reserva.findAndCountAll({
        where: { id_usuario: usuarioId },
        order: [["data_reserva", "DESC"]],
        limit: Number(limit),
        offset,
      });

      const formatted = rows.map((r) => formatReservaObject(r.toJSON()));

      res.status(200).json({
        success: true,
        data: formatted,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Reservas do usuário listadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar reservas por usuário:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async createReserva(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, id_livro, data_expiracao } = req.body;

      if (!id_usuario || !id_livro) {
        res.status(400).json({
          success: false,
          message: "Usuário e livro são obrigatórios",
        });
        return;
      }

      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario) {
        res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
        return;
      }

      const livro = await Livro.findByPk(id_livro);
      if (!livro) {
        res
          .status(404)
          .json({ success: false, message: "Livro não encontrado" });
        return;
      }

      // Verificar se usuário já tem reserva ativa para este livro
      const existe = await Reserva.findOne({
        where: { id_usuario, id_livro, status: "ativa" },
      });
      if (existe) {
        res.status(409).json({
          success: false,
          message: "Usuário já possui reserva ativa deste livro",
        });
        return;
      }

      // Definir expiração: interpretar data_expiracao como horário de São Paulo (se vier sem fuso)
      let expiracao = data_expiracao ? parseToUTC(data_expiracao) : null;
      if (!expiracao) {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 2); // Alterado para 2 minutos para facilitar testes
        expiracao = d;
      }

      // Criar reserva; se houver estoque, decrementar dentro de transação e notificar quando ficar em 1
      let createdReserva: any = null;
      await sequelize.transaction(async (t) => {
        // Recarregar livro com lock
        const livroTx = await Livro.findByPk(id_livro, {
          transaction: t,
          lock: t.LOCK.UPDATE as any,
        });
        if (!livroTx) {
          throw new Error("Livro não encontrado durante a transação");
        }

        if (livroTx.qt_atual > 0) {
          const newQt = livroTx.qt_atual - 1;
          await livroTx.update({ qt_atual: newQt }, { transaction: t });
          createdReserva = await Reserva.create(
            {
              id_usuario,
              id_livro,
              data_reserva: new Date(),
              data_expiracao: expiracao,
              status: "ativa",
            },
            { transaction: t }
          );

          // notificar serviço quando estoque chegar a 1
          if (newQt === 1) {
            try {
              // notificar de forma assíncrona, não falhar a transação se notificação falhar
              await notifyLowStock(livroTx.id_livro, newQt);
            } catch (err) {
              console.error("Erro ao notificar estoque baixo:", err);
            }
          }
        } else {
          // Sem exemplares no momento: criar reserva normalmente (fila)
          createdReserva = await Reserva.create(
            {
              id_usuario,
              id_livro,
              data_reserva: new Date(),
              data_expiracao: expiracao,
              status: "ativa",
            },
            { transaction: t }
          );
        }
      });

      if (createdReserva) {
        res.status(201).json({
          success: true,
          data: formatReservaObject(createdReserva.toJSON()),
          message: "Reserva criada com sucesso",
        });
      }
    } catch (error) {
      // erro já respondido dentro da transação (por exemplo livro não disponível)
      if (res.headersSent) return;
      console.error("Erro ao criar reserva:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        res
          .status(404)
          .json({ success: false, message: "Reserva não encontrada" });
        return;
      }
      if (reserva.status !== "ativa") {
        res.status(400).json({
          success: false,
          message: "Apenas reservas ativas podem ser canceladas",
        });
        return;
      }
      // cancelar e repor estoque em transação
      await sequelize.transaction(async (t) => {
        const livroTx = await Livro.findByPk(reserva.id_livro, {
          transaction: t,
          lock: t.LOCK.UPDATE as any,
        });
        if (!livroTx) {
          throw new Error("Livro não encontrado durante cancelamento");
        }

        await reserva.update({ status: "cancelada" }, { transaction: t });
        await livroTx.update(
          { qt_atual: livroTx.qt_atual + 1 },
          { transaction: t }
        );

        res.status(200).json({
          success: true,
          data: formatReservaObject(reserva.toJSON()),
          message: "Reserva cancelada com sucesso",
        });
      });
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async concretizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        res
          .status(404)
          .json({ success: false, message: "Reserva não encontrada" });
        return;
      }
      if (reserva.status !== "ativa") {
        res.status(400).json({
          success: false,
          message: "Apenas reservas ativas podem ser concretizadas",
        });
        return;
      }

      // marcar como concretizada
      await reserva.update({ status: "concretizada" });

      res.status(200).json({
        success: true,
        data: formatReservaObject(reserva.toJSON()),
        message: "Reserva concretizada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao concretizar reserva:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }
}

export default ReservaController;
