import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationHelper } from '../authentication/authentication.helper';
import { ExecutionManager } from '../util/execution.manager';

@Injectable()
export class ExecutionContextBinder implements NestMiddleware {
  constructor(private readonly auth: AuthenticationHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    ExecutionManager.runWithContext(async () => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
          const user = this.auth.validateAuthToken(token);
          ExecutionManager.setTenantId(user.tenantId);
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}
