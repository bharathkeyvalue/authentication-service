import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ExecutionManager } from '../util/execution.manager';

export class ExecutionContextBinder implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    ExecutionManager.runWithContext(next);
  }
}
