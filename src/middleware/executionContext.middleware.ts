import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationHelper } from '../authentication/authentication.helper';
import { ExecutionManager } from '../util/execution.manager';
import { TokenUtil } from '../authentication/util/token.util';

@Injectable()
export class ExecutionContextBinder implements NestMiddleware {
  constructor(private readonly auth: AuthenticationHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    ExecutionManager.runWithContext(async () => {
      try {
        const token = req.headers.authorization;
        if (token) {
          const reqAuthToken = TokenUtil.extractToken(token);
          const user = this.auth.validateAuthToken(reqAuthToken);
          ExecutionManager.setTenantId(user.tenantId);
        }
        next();
      } catch (error) {
        next();
      }
    });
  }
}
