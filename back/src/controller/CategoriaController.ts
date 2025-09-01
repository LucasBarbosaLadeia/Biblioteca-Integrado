import { Request, Response } from "express";
import Categoria, { ICategoria } from "../models/Categoria";
import Livro from "../models/Livro";
import { Op } from "sequelize";

export class CategoriaController {
  // Listar todas as categorias
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await Categoria.findAll({
        order: [["nome", "ASC"]],
      });

      res.status(200).json({
        success: true,
        data: categorias,
        message: "Categorias listadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar categoria por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id, {
        include: [
          {
            model: Livro,
            as: "livros",
            attributes: ["id_livro", "titulo", "autor", "qt_atual", "qt_total"],
          },
        ],
      });

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: categoria,
        message: "Categoria encontrada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar categoria por nome
  static async getByNome(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.params;
      const categoria = await Categoria.findOne({
        where: { nome: { [Op.like]: `%${nome}%` } },
        include: [
          {
            model: Livro,
            as: "livros",
            attributes: ["id_livro", "titulo", "autor", "qt_atual", "qt_total"],
          },
        ],
      });

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: categoria,
        message: "Categoria encontrada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar categoria por nome:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Criar nova categoria
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.body;

      // Validações básicas
      if (!nome || nome.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Nome da categoria é obrigatório",
        });
        return;
      }

      // Verificar se categoria já existe
      const categoriaExists = await Categoria.findOne({
        where: { nome: nome.trim() },
      });
      if (categoriaExists) {
        res.status(409).json({
          success: false,
          message: "Categoria já existe",
        });
        return;
      }

      const novaCategoria = await Categoria.create({
        nome: nome.trim(),
      });

      res.status(201).json({
        success: true,
        data: novaCategoria,
        message: "Categoria criada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Atualizar categoria
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      // Validações básicas
      if (!nome || nome.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Nome da categoria é obrigatório",
        });
        return;
      }

      // Verificar se categoria já existe (exceto para a própria categoria)
      const categoriaExists = await Categoria.findOne({
        where: {
          nome: nome.trim(),
          // @ts-ignore
          id_categoria: { [Op.ne]: id },
        },
      });
      if (categoriaExists) {
        res.status(409).json({
          success: false,
          message: "Categoria já existe",
        });
        return;
      }

      await categoria.update({ nome: nome.trim() });

      res.status(200).json({
        success: true,
        data: categoria,
        message: "Categoria atualizada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Deletar categoria
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      // Verificar se há livros associados à categoria
      const livrosCount = await Livro.count({ where: { id_categoria: id } });
      if (livrosCount > 0) {
        res.status(400).json({
          success: false,
          message: `Não é possível deletar categoria com ${livrosCount} livro(s) associado(s)`,
        });
        return;
      }

      await categoria.destroy();

      res.status(200).json({
        success: true,
        message: "Categoria deletada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Obter estatísticas da categoria
  static async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      // Contar livros na categoria
      const totalLivros = await Livro.count({ where: { id_categoria: id } });

      // Contar livros disponíveis
      const livrosDisponiveis = await Livro.count({
        where: {
          id_categoria: id,
          qt_atual: { [Op.gt]: 0 },
        },
      });

      // Contar livros emprestados
      const livrosEmprestados = totalLivros - livrosDisponiveis;

      // Obter total de exemplares
      const totalExemplares =
        (await Livro.sum("qt_total", {
          where: { id_categoria: id },
        })) || 0;

      const exemplaresDisponiveis =
        (await Livro.sum("qt_atual", {
          where: { id_categoria: id },
        })) || 0;

      const exemplaresEmprestados = totalExemplares - exemplaresDisponiveis;

      res.status(200).json({
        success: true,
        data: {
          categoria: {
            id_categoria: categoria.id_categoria,
            nome: categoria.nome,
          },
          estatisticas: {
            totalLivros,
            livrosDisponiveis,
            livrosEmprestados,
            totalExemplares,
            exemplaresDisponiveis,
            exemplaresEmprestados,
          },
        },
        message: "Estatísticas da categoria obtidas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao obter estatísticas da categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }
}
