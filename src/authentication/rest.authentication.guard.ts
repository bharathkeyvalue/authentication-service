import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationHelper } from './authentication.helper';
import { TokenUtil } from './util/token.util';

@Injectable()
export class RestAuthGuard implements CanActivate {
  constructor(private authenticationHelper: AuthenticationHelper) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const reqAuthToken = TokenUtil.extractToken(ctx.headers.authorization);
    const req = await this.authenticationHelper.validateAuthToken(reqAuthToken);
    if (!(req instanceof UnauthorizedException)) {
      return true;
    } else {
      throw req;
    }
  }
}
