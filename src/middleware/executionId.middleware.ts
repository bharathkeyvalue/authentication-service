import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ExecutionManager } from '../util/execution.manager';
import { AuthenticationHelper } from '../authentication/authentication.helper';

export class ExecutionContextBinder implements NestMiddleware {
  constructor(private readonly auth: AuthenticationHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    ExecutionManager.runWithContext(async () => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const user = this.auth.validateAuthToken(token);
        ExecutionManager.setTenantId(user.tenantId);
      }
      next();
    });
  }
}
