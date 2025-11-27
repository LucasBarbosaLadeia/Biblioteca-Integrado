import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "seu-segredo-super-secreto";

export interface UserPayload {
  id: number;
  email: string;
  tipo: "aluno" | "funcionario" | "admin";
}

// Extender o tipo Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

/**
 * Middleware de Autenticação
 * Verifica se o token JWT é válido
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Token não fornecido. Acesso negado.",
      });
      return;
    }

    // Formato esperado: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use 'Bearer TOKEN'.",
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    // Adicionar informações do usuário à requisição
    req.user = decoded;

    console.log(
      `[AUTH] ✅ Usuário autenticado: ${decoded.email} (${decoded.tipo})`
    );

    next();
  } catch (error) {
    console.error("[AUTH] ❌ Erro na autenticação:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token expirado. Faça login novamente.",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Erro ao verificar autenticação.",
    });
  }
};

/**
 * Middleware de Autorização
 * Verifica se o usuário tem a role necessária
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
      return;
    }

    const userRole = req.user.tipo;

    if (!allowedRoles.includes(userRole)) {
      console.log(
        `[AUTH] ⛔ Acesso negado: ${
          req.user.email
        } (${userRole}) tentou acessar rota protegida. Roles permitidas: ${allowedRoles.join(
          ", "
        )}`
      );

      res.status(403).json({
        success: false,
        message: `Acesso negado. Apenas ${allowedRoles.join(
          " ou "
        )} podem acessar este recurso.`,
      });
      return;
    }

    console.log(`[AUTH] ✅ Acesso autorizado: ${req.user.email} (${userRole})`);

    next();
  };
};

/**
 * Middleware para verificar se é Admin
 */
export const isAdmin = authorizeRoles("admin");

/**
 * Middleware para verificar se é Funcionário ou Admin (Bibliotecário)
 */
export const isLibrarian = authorizeRoles("funcionario", "admin");

/**
 * Middleware para verificar se é qualquer usuário autenticado
 */
export const isAuthenticated = authMiddleware;
