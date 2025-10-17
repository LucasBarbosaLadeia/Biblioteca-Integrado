import { Request, Response } from "express";
import Favorito, { IFavorito } from "../models/Favorito";
import Usuario from "../models/Usuario";
import Livro from "../models/Livro";
import Categoria from "../models/Categoria";

export class FavoritoController {
  // Listar todos os favoritos
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, usuario, livro } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause: any = {};

      // Filtro por usuário
      if (usuario) {
        whereClause.id_usuario = usuario;
      }

      // Filtro por livro
      if (livro) {
        whereClause.id_livro = livro;
      }

      const { count, rows: favoritos } = await Favorito.findAndCountAll({
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
            attributes: [
              "id_livro",
              "titulo",
              "autor",
              "isbn",
              "qt_atual",
              "qt_total",
            ],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: favoritos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Favoritos listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar favoritos:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar favorito por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const favorito = await Favorito.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: [
              "id_livro",
              "titulo",
              "autor",
              "isbn",
              "qt_atual",
              "qt_total",
            ],
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

      if (!favorito) {
        res.status(404).json({
          success: false,
          message: "Favorito não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: favorito,
        message: "Favorito encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar favoritos por usuário
  static async getByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: favoritos } = await Favorito.findAndCountAll({
        where: { id_usuario: usuarioId },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: [
              "id_livro",
              "titulo",
              "autor",
              "isbn",
              "qt_atual",
              "qt_total",
              "capa_url",
              "sinopse",
              "prateleira",
              "ano_publicacao",
              "paginas",
            ],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: favoritos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Favoritos do usuário listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar favoritos por usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar favoritos por livro
  static async getByLivro(req: Request, res: Response): Promise<void> {
    try {
      const { livroId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: favoritos } = await Favorito.findAndCountAll({
        where: { id_livro: livroId },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email", "RA", "tipo"],
          },
          {
            model: Livro,
            as: "livro",
            attributes: [
              "id_livro",
              "titulo",
              "autor",
              "isbn",
              "qt_atual",
              "qt_total",
            ],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: offset,
      });

      res.status(200).json({
        success: true,
        data: favoritos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        message: "Favoritos do livro listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar favoritos por livro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Verificar se livro é favorito do usuário
  static async isFavorito(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, livroId } = req.params;

      const favorito = await Favorito.findOne({
        where: {
          id_usuario: usuarioId,
          id_livro: livroId,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          isFavorito: !!favorito,
          favoritoId: favorito?.id_favorito || null,
        },
        message: "Status de favorito verificado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Adicionar livro aos favoritos
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, id_livro } = req.body;

      // Validações básicas
      if (!id_usuario || !id_livro) {
        res.status(400).json({
          success: false,
          message: "Usuário e livro são obrigatórios",
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

      // Verificar se já é favorito
      const favoritoExistente = await Favorito.findOne({
        where: {
          id_usuario,
          id_livro,
        },
      });

      if (favoritoExistente) {
        res.status(409).json({
          success: false,
          message: "Livro já está nos favoritos do usuário",
        });
        return;
      }

      // Criar favorito
      const novoFavorito = await Favorito.create({
        id_usuario,
        id_livro,
      });

      // Retornar favorito com dados relacionados
      const favoritoCompleto = await Favorito.findByPk(
        novoFavorito.id_favorito,
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
              attributes: [
                "id_livro",
                "titulo",
                "autor",
                "isbn",
                "qt_atual",
                "qt_total",
              ],
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
        data: favoritoCompleto,
        message: "Livro adicionado aos favoritos com sucesso",
      });
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Remover livro dos favoritos
  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const favorito = await Favorito.findByPk(id);
      if (!favorito) {
        res.status(404).json({
          success: false,
          message: "Favorito não encontrado",
        });
        return;
      }

      await favorito.destroy();

      res.status(200).json({
        success: true,
        message: "Livro removido dos favoritos com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Remover favorito por usuário e livro
  static async removeByUsuarioLivro(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { usuarioId, livroId } = req.params;

      const favorito = await Favorito.findOne({
        where: {
          id_usuario: usuarioId,
          id_livro: livroId,
        },
      });

      if (!favorito) {
        res.status(404).json({
          success: false,
          message: "Favorito não encontrado",
        });
        return;
      }

      await favorito.destroy();

      res.status(200).json({
        success: true,
        message: "Livro removido dos favoritos com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Toggle favorito (adicionar se não existe, remover se existe)
  static async toggle(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, id_livro } = req.body;

      // Validações básicas
      if (!id_usuario || !id_livro) {
        res.status(400).json({
          success: false,
          message: "Usuário e livro são obrigatórios",
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

      // Verificar se já é favorito
      const favoritoExistente = await Favorito.findOne({
        where: {
          id_usuario,
          id_livro,
        },
      });

      if (favoritoExistente) {
        // Remover dos favoritos
        await favoritoExistente.destroy();

        res.status(200).json({
          success: true,
          data: { isFavorito: false },
          message: "Livro removido dos favoritos com sucesso",
        });
      } else {
        // Adicionar aos favoritos
        const novoFavorito = await Favorito.create({
          id_usuario,
          id_livro,
        });

        res.status(201).json({
          success: true,
          data: { isFavorito: true, favoritoId: novoFavorito.id_favorito },
          message: "Livro adicionado aos favoritos com sucesso",
        });
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Deletar favorito
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const favorito = await Favorito.findByPk(id);
      if (!favorito) {
        res.status(404).json({
          success: false,
          message: "Favorito não encontrado",
        });
        return;
      }

      await favorito.destroy();

      res.status(200).json({
        success: true,
        message: "Favorito deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar favorito:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Obter estatísticas de favoritos
  static async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const totalFavoritos = await Favorito.count();

      // Top 5 livros mais favoritados
      const livrosMaisFavoritados = await Favorito.findAll({
        attributes: [
          "id_livro",
          [
            Favorito.sequelize!.fn(
              "COUNT",
              Favorito.sequelize!.col("id_livro")
            ),
            "total_favoritos",
          ],
        ],
        include: [
          {
            model: Livro,
            as: "livro",
            attributes: ["id_livro", "titulo", "autor"],
            include: [
              {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nome"],
              },
            ],
          },
        ],
        group: [
          "id_livro",
          "livro.id_livro",
          "livro.titulo",
          "livro.autor",
          "livro.categoria.id_categoria",
          "livro.categoria.nome",
        ],
        order: [
          [
            Favorito.sequelize!.fn(
              "COUNT",
              Favorito.sequelize!.col("id_livro")
            ),
            "DESC",
          ],
        ],
        limit: 5,
      });

      res.status(200).json({
        success: true,
        data: {
          totalFavoritos,
          livrosMaisFavoritados,
        },
        message: "Estatísticas de favoritos obtidas com sucesso",
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
