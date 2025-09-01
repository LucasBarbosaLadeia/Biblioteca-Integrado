import { Request, Response } from "express";
import Livro, { ILivro } from "../models/Livro";
import Categoria from "../models/Categoria";
import { Op } from "sequelize";

export class LivroController {
  // Listar todos os livros
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, categoria } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause: any = {};

      // Filtro por busca (título ou autor)
      if (search) {
        whereClause[Op.or] = [
          { titulo: { [Op.like]: `%${search}%` } },
          { autor: { [Op.like]: `%${search}%` } },
        ];
      }

      // Filtro por categoria
      if (categoria) {
        whereClause.id_categoria = categoria;
      }

      const { count, rows: livros } = await Livro.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
        order: [["titulo", "ASC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: livros,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Livros listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar livros:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar livro por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const livro = await Livro.findByPk(id, {
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
      });

      if (!livro) {
        res.status(404).json({
          success: false,
          message: "Livro não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: livro,
        message: "Livro encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar livros por categoria
  static async getByCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { categoriaId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: livros } = await Livro.findAndCountAll({
        where: { id_categoria: categoriaId },
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
        order: [["titulo", "ASC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: livros,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Livros da categoria listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar livros por categoria:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar livros disponíveis
  static async getDisponiveis(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: livros } = await Livro.findAndCountAll({
        where: {
          qt_atual: { [Op.gt]: 0 }, // Quantidade atual maior que 0
        },
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
        order: [["titulo", "ASC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: livros,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Livros disponíveis listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar livros disponíveis:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Criar novo livro
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        titulo,
        autor,
        id_categoria,
        ano_publicacao,
        capa_url,
        sinopse,
        prateleira,
        isbn,
        qt_total,
      } = req.body;

      // Validações básicas
      if (!titulo || !autor || !id_categoria || !qt_total) {
        res.status(400).json({
          success: false,
          message:
            "Título, autor, categoria e quantidade total são obrigatórios",
        });
        return;
      }

      // Verificar se a categoria existe
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
        return;
      }

      // Verificar se ISBN já existe (se fornecido)
      if (isbn) {
        const isbnExists = await Livro.findOne({ where: { isbn } });
        if (isbnExists) {
          res.status(409).json({
            success: false,
            message: "ISBN já cadastrado",
          });
          return;
        }
      }

      // Validar quantidade
      if (qt_total < 0) {
        res.status(400).json({
          success: false,
          message: "Quantidade total deve ser maior ou igual a 0",
        });
        return;
      }

      const novoLivro = await Livro.create({
        titulo,
        autor,
        id_categoria,
        ano_publicacao,
        capa_url,
        sinopse,
        prateleira,
        isbn,
        qt_atual: qt_total, // Quantidade atual inicia igual à total
        qt_total,
      });

      // Retornar livro com categoria
      const livroCompleto = await Livro.findByPk(novoLivro.id_livro, {
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
      });

      res.status(201).json({
        success: true,
        data: livroCompleto,
        message: "Livro criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Atualizar livro
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        titulo,
        autor,
        id_categoria,
        ano_publicacao,
        capa_url,
        sinopse,
        prateleira,
        isbn,
        qt_atual,
        qt_total,
      } = req.body;

      const livro = await Livro.findByPk(id);
      if (!livro) {
        res.status(404).json({
          success: false,
          message: "Livro não encontrado",
        });
        return;
      }

      // Verificar se a categoria existe (se fornecida)
      if (id_categoria) {
        const categoria = await Categoria.findByPk(id_categoria);
        if (!categoria) {
          res.status(404).json({
            success: false,
            message: "Categoria não encontrada",
          });
          return;
        }
      }

      // Verificar se ISBN já existe (exceto para o próprio livro)
      if (isbn && isbn !== livro.isbn) {
        const isbnExists = await Livro.findOne({
          where: { isbn },
          // @ts-ignore
          id_livro: { [Op.ne]: id },
        });
        if (isbnExists) {
          res.status(409).json({
            success: false,
            message: "ISBN já cadastrado",
          });
          return;
        }
      }

      // Validações de quantidade
      if (qt_total !== undefined && qt_total < 0) {
        res.status(400).json({
          success: false,
          message: "Quantidade total deve ser maior ou igual a 0",
        });
        return;
      }

      if (qt_atual !== undefined && qt_atual < 0) {
        res.status(400).json({
          success: false,
          message: "Quantidade atual deve ser maior ou igual a 0",
        });
        return;
      }

      // Preparar dados para atualização
      const updateData: Partial<ILivro> = {};
      if (titulo) updateData.titulo = titulo;
      if (autor) updateData.autor = autor;
      if (id_categoria) updateData.id_categoria = id_categoria;
      if (ano_publicacao !== undefined)
        updateData.ano_publicacao = ano_publicacao;
      if (capa_url !== undefined) updateData.capa_url = capa_url;
      if (sinopse !== undefined) updateData.sinopse = sinopse;
      if (prateleira !== undefined) updateData.prateleira = prateleira;
      if (isbn !== undefined) updateData.isbn = isbn;
      if (qt_atual !== undefined) updateData.qt_atual = qt_atual;
      if (qt_total !== undefined) updateData.qt_total = qt_total;

      await livro.update(updateData);

      // Retornar livro atualizado com categoria
      const livroAtualizado = await Livro.findByPk(id, {
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["id_categoria", "nome"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: livroAtualizado,
        message: "Livro atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Deletar livro
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const livro = await Livro.findByPk(id);
      if (!livro) {
        res.status(404).json({
          success: false,
          message: "Livro não encontrado",
        });
        return;
      }

      // Verificar se há empréstimos ativos
      if (livro.qt_atual < livro.qt_total) {
        res.status(400).json({
          success: false,
          message: "Não é possível deletar livro com empréstimos ativos",
        });
        return;
      }

      await livro.destroy();

      res.status(200).json({
        success: true,
        message: "Livro deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Atualizar quantidade de livros (para empréstimos/devoluções)
  static async updateQuantidade(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { operacao, quantidade } = req.body; // operacao: 'emprestar' ou 'devolver'

      if (
        !operacao ||
        !quantidade ||
        !["emprestar", "devolver"].includes(operacao)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Operação deve ser 'emprestar' ou 'devolver' e quantidade deve ser fornecida",
        });
        return;
      }

      const livro = await Livro.findByPk(id);
      if (!livro) {
        res.status(404).json({
          success: false,
          message: "Livro não encontrado",
        });
        return;
      }

      let novaQuantidade = livro.qt_atual;

      if (operacao === "emprestar") {
        if (livro.qt_atual < quantidade) {
          res.status(400).json({
            success: false,
            message: "Quantidade insuficiente para empréstimo",
          });
          return;
        }
        novaQuantidade -= quantidade;
      } else if (operacao === "devolver") {
        if (livro.qt_atual + quantidade > livro.qt_total) {
          res.status(400).json({
            success: false,
            message: "Quantidade de devolução excede o total de livros",
          });
          return;
        }
        novaQuantidade += quantidade;
      }

      await livro.update({ qt_atual: novaQuantidade });

      res.status(200).json({
        success: true,
        data: { qt_atual: novaQuantidade, qt_total: livro.qt_total },
        message: `Quantidade atualizada com sucesso. Operação: ${operacao}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }
}
