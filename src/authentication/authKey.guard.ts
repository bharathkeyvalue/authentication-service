import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx) {
      const authKeyInHeader = ctx.headers['x-api-key'];
      if (authKeyInHeader) {
        const secretKey = this.configService.get('AUTH_KEY') as string;
        return secretKey === authKeyInHeader;
      }
    }
    return false;
  }
}
