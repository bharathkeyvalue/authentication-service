import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationHelper } from './authentication.helper';
import { TokenUtil } from './util/token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authenticationHelper: AuthenticationHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx) {
      const token = ctx.headers.authorization;
      if (token) {
        const reqAuthToken = TokenUtil.extractToken(token);
        ctx.user = this.authenticationHelper.validateAuthToken(reqAuthToken);
        return true;
      }
    }
    return false;
  }
}
