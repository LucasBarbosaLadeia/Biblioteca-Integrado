import { Request, Response } from "express";
import Emprestimo, { IEmprestimo } from "../models/Emprestimo";
import Usuario from "../models/Usuario";
import Livro from "../models/Livro";
import Categoria from "../models/Categoria";
import { Op } from "sequelize";

export class EmprestimoController {
  // Listar todos os empréstimos
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, usuario, livro } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause: any = {};

      // Filtro por status
      if (status) {
        whereClause.status = status;
      }

      // Filtro por usuário
      if (usuario) {
        whereClause.id_usuario = usuario;
      }

      // Filtro por livro
      if (livro) {
        whereClause.id_livro = livro;
      }

      const { count, rows: emprestimos } = await Emprestimo.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["data_emprestimo", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: emprestimos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Empréstimos listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar empréstimos:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar empréstimo por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const emprestimo = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
      });

      if (!emprestimo) {
        res.status(404).json({
          success: false,
          message: "Empréstimo não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: emprestimo,
        message: "Empréstimo encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar empréstimo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar empréstimos por usuário
  static async getByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause: any = { id_usuario: usuarioId };

      if (status) {
        whereClause.status = status;
      }

      const { count, rows: emprestimos } = await Emprestimo.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["data_emprestimo", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: emprestimos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Empréstimos do usuário listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar empréstimos por usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar empréstimos ativos
  static async getAtivos(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: emprestimos } = await Emprestimo.findAndCountAll({
        where: { status: "ativo" },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["data_emprestimo", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: emprestimos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Empréstimos ativos listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar empréstimos ativos:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar empréstimos atrasados
  static async getAtrasados(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const hoje = new Date().toISOString().split("T")[0];

      const { count, rows: emprestimos } = await Emprestimo.findAndCountAll({
        where: {
          status: "ativo",
          data_devolucao_prevista: { [Op.lt]: hoje },
        },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["data_devolucao_prevista", "ASC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: emprestimos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Empréstimos atrasados listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar empréstimos atrasados:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Criar novo empréstimo
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, id_livro, data_devolucao_prevista } = req.body;

      // Validações básicas
      if (!id_usuario || !id_livro || !data_devolucao_prevista) {
        res.status(400).json({
          success: false,
          message:
            "Usuário, livro e data de devolução prevista são obrigatórios",
        });
        return;
      }

      // Verificar se usuário existe
      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
        return;
      }

      // Verificar se livro existe
      const livro = await Livro.findByPk(id_livro);
      if (!livro) {
        res.status(404).json({
          success: false,
          message: "Livro não encontrado",
        });
        return;
      }

      // Verificar se há exemplares disponíveis
      if (livro.qt_atual <= 0) {
        res.status(400).json({
          success: false,
          message: "Livro não disponível para empréstimo",
        });
        return;
      }

      // Verificar se usuário já tem empréstimo ativo deste livro
      const emprestimoExistente = await Emprestimo.findOne({
        where: {
          id_usuario,
          id_livro,
          status: "ativo",
        },
      });

      if (emprestimoExistente) {
        res.status(409).json({
          success: false,
          message: "Usuário já possui empréstimo ativo deste livro",
        });
        return;
      }

      // Validar data de devolução
      const hoje = new Date();
      const dataDevolucao = new Date(data_devolucao_prevista);

      if (dataDevolucao <= hoje) {
        res.status(400).json({
          success: false,
          message: "Data de devolução deve ser futura",
        });
        return;
      }

      // Criar empréstimo
      const novoEmprestimo = await Emprestimo.create({
        id_usuario,
        id_livro,
        data_emprestimo: hoje,
        data_devolucao_prevista: dataDevolucao,
        status: "ativo",
      });

      // Atualizar quantidade do livro
      await livro.update({ qt_atual: livro.qt_atual - 1 });

      // Retornar empréstimo com dados relacionados
      const emprestimoCompleto = await Emprestimo.findByPk(
        novoEmprestimo.id_emprestimo,
        {
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
            },
            {
              model: Livro,
              as: "livro",
              attributes: ["id_livro", "titulo", "autor", "isbn"],
              include: [
                {
                  model: Categoria,
                  as: "categoria",
                  attributes: ["id_categoria", "nome"],
                },
              ],
            },
          ],
        }
      );

      res.status(201).json({
        success: true,
        data: emprestimoCompleto,
        message: "Empréstimo criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar empréstimo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Devolver livro
  static async devolver(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const emprestimo = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Livro,
            as: "livro",
          },
        ],
      });

      if (!emprestimo) {
        res.status(404).json({
          success: false,
          message: "Empréstimo não encontrado",
        });
        return;
      }

      if (emprestimo.status !== "ativo") {
        res.status(400).json({
          success: false,
          message: "Empréstimo já foi devolvido",
        });
        return;
      }

      // Atualizar empréstimo
      const hoje = new Date();
      await emprestimo.update({
        data_devolucao_real: hoje,
        status: "devolvido",
      });

      // Atualizar quantidade do livro
      const livro = (emprestimo as any).livro;
      await livro.update({ qt_atual: livro.qt_atual + 1 });

      // Retornar empréstimo atualizado
      const emprestimoAtualizado = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: emprestimoAtualizado,
        message: "Livro devolvido com sucesso",
      });
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Renovar empréstimo
  static async renovar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nova_data_devolucao } = req.body;

      if (!nova_data_devolucao) {
        res.status(400).json({
          success: false,
          message: "Nova data de devolução é obrigatória",
        });
        return;
      }

      const emprestimo = await Emprestimo.findByPk(id);

      if (!emprestimo) {
        res.status(404).json({
          success: false,
          message: "Empréstimo não encontrado",
        });
        return;
      }

      if (emprestimo.status !== "ativo") {
        res.status(400).json({
          success: false,
          message: "Apenas empréstimos ativos podem ser renovados",
        });
        return;
      }

      // Validar nova data
      const novaData = new Date(nova_data_devolucao);
      const hoje = new Date();

      if (novaData <= hoje) {
        res.status(400).json({
          success: false,
          message: "Nova data de devolução deve ser futura",
        });
        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: novaData,
      });

      // Retornar empréstimo atualizado
      const emprestimoAtualizado = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor", "isbn"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: emprestimoAtualizado,
        message: "Empréstimo renovado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao renovar empréstimo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Deletar empréstimo (apenas se não ativo)
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const emprestimo = await Emprestimo.findByPk(id);
      if (!emprestimo) {
        res.status(404).json({
          success: false,
          message: "Empréstimo não encontrado",
        });
        return;
      }

      if (emprestimo.status === "ativo") {
        res.status(400).json({
          success: false,
          message:
            "Não é possível deletar empréstimo ativo. Devolva o livro primeiro.",
        });
        return;
      }

      await emprestimo.destroy();

      res.status(200).json({
        success: true,
        message: "Empréstimo deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar empréstimo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Obter estatísticas de empréstimos
  static async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const hoje = new Date().toISOString().split("T")[0];

      const [
        totalEmprestimos,
        emprestimosAtivos,
        emprestimosDevolvidos,
        emprestimosAtrasados,
      ] = await Promise.all([
        Emprestimo.count(),
        Emprestimo.count({ where: { status: "ativo" } }),
        Emprestimo.count({ where: { status: "devolvido" } }),
        Emprestimo.count({
          where: {
            status: "ativo",
            data_devolucao_prevista: { [Op.lt]: hoje },
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalEmprestimos,
          emprestimosAtivos,
          emprestimosDevolvidos,
          emprestimosAtrasados,
        },
        message: "Estatísticas de empréstimos obtidas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }
}
