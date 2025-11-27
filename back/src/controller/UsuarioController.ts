import { Request, Response } from "express";
import Usuario, { IUsuario } from "../models/Usuario";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsuarioController {
  // Listar todos os usuários
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ["senha"] }, // Excluir senha da resposta
        order: [["nome", "ASC"]],
      });

      res.status(200).json({
        success: true,
        data: usuarios,
        message: "Usuários listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar usuário por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] },
      });

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: usuario,
        message: "Usuário encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar usuário por RA
  static async getByRA(req: Request, res: Response): Promise<void> {
    try {
      const { ra } = req.params;
      const usuario = await Usuario.findOne({
        where: { RA: ra },
        attributes: { exclude: ["senha"] },
      });

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: usuario,
        message: "Usuário encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar usuário por RA:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Criar novo usuário
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, RA, tipo } = req.body;

      // Validações básicas
      if (!nome || !email || !senha || !RA || !tipo) {
        res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios",
        });
        return;
      }

      if (!["aluno", "funcionario", "admin"].includes(tipo)) {
        res.status(400).json({
          success: false,
          message: "Tipo deve ser 'aluno', 'funcionario' ou 'admin'",
        });
        return;
      }

      // Verificar se email já existe
      const emailExists = await Usuario.findOne({ where: { email } });
      if (emailExists) {
        res.status(409).json({
          success: false,
          message: "Email já cadastrado",
        });
        return;
      }

      // Verificar se RA já existe
      const raExists = await Usuario.findOne({ where: { RA } });
      if (raExists) {
        res.status(409).json({
          success: false,
          message: "RA já cadastrado",
        });
        return;
      }

      // Criptografar senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: hashedPassword,
        RA,
        tipo,
      });

      // Retornar usuário sem a senha
      const usuarioResponse = await Usuario.findByPk(novoUsuario.id_usuario, {
        attributes: { exclude: ["senha"] },
      });

      res.status(201).json({
        success: true,
        data: usuarioResponse,
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Atualizar usuário
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, email, senha, RA, tipo } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
        return;
      }

      // Validação do tipo se fornecido
      if (tipo && !["aluno", "funcionario", "admin"].includes(tipo)) {
        res.status(400).json({
          success: false,
          message: "Tipo deve ser 'aluno', 'funcionario' ou 'admin'",
        });
        return;
      }

      // Verificar se email já existe (exceto para o próprio usuário)
      if (email && email !== usuario.email) {
        const emailExists = await Usuario.findOne({
          where: { email },
          // @ts-ignore
          id_usuario: { [Op.ne]: id },
        });
        if (emailExists) {
          res.status(409).json({
            success: false,
            message: "Email já cadastrado",
          });
          return;
        }
      }

      // Verificar se RA já existe (exceto para o próprio usuário)
      if (RA && RA !== usuario.RA) {
        const raExists = await Usuario.findOne({
          where: { RA },
          // @ts-ignore
          id_usuario: { [Op.ne]: id },
        });
        if (raExists) {
          res.status(409).json({
            success: false,
            message: "RA já cadastrado",
          });
          return;
        }
      }

      // Preparar dados para atualização
      const updateData: Partial<IUsuario> = {};
      if (nome) updateData.nome = nome;
      if (email) updateData.email = email;
      if (RA) updateData.RA = RA;
      if (tipo) updateData.tipo = tipo;

      // Criptografar nova senha se fornecida
      if (senha) {
        const saltRounds = 10;
        updateData.senha = await bcrypt.hash(senha, saltRounds);
      }

      await usuario.update(updateData);

      // Retornar usuário atualizado sem a senha
      const usuarioAtualizado = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] },
      });

      res.status(200).json({
        success: true,
        data: usuarioAtualizado,
        message: "Usuário atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Deletar usuário
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
        return;
      }

      await usuario.destroy();

      res.status(200).json({
        success: true,
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Login de usuário
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { ra, senha } = req.body;

      if (!ra || !senha) {
        res.status(400).json({
          success: false,
          message: "RA e senha são obrigatórios",
        });
        return;
      }

      const usuario = await Usuario.findOne({ where: { RA: ra } });
      if (!usuario) {
        res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
        return;
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
        return;
      }

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
        process.env.JWT_SECRET || "seu-segredo-super-secreto",
        { expiresIn: "24h" }
      );

      // Retornar usuário sem a senha
      const usuarioResponse = await Usuario.findByPk(usuario.id_usuario, {
        attributes: { exclude: ["senha"] },
      });

      res.status(200).json({
        success: true,
        token,
        data: usuarioResponse,
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }
}
