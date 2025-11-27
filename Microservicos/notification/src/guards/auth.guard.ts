import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

// definicao do payload do JWT
export interface UserPayload {
  id: number;
  nome: string;
  email: string;
  tipo: 'aluno' | 'funcionario' | 'admin';
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    // verifica se tem o header de autorizacao
    if (!authHeader) {
      console.log('[Auth] Token nao fornecido na requisicao');
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    // pega o secret do env ou usa o padrao
    const secret = process.env.JWT_SECRET || 'seu-segredo-super-secreto';

    try {
      const decoded = verify(token, secret) as UserPayload;
      request.user = decoded;
      console.log(
        `[Auth] Usuario logado: ${decoded.email} - tipo: ${decoded.tipo}`,
      );

      // checa se precisa de role especifica
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (roles && roles.length > 0) {
        const hasRole = roles.includes(decoded.tipo);
        if (!hasRole) {
          console.log(
            `[Auth] Permissao negada - usuario ${decoded.tipo} tentou acessar rota que precisa de: ${roles.join(' ou ')}`,
          );
          throw new ForbiddenException(
            `Acesso negado. Necessário ser: ${roles.join(' ou ')}`,
          );
        }
        console.log(`[Auth] Permissao OK para tipo ${decoded.tipo}`);
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'erro desconhecido';
      console.log('[Auth] Problema com o token:', errorMessage);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
