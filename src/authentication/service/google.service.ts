import { Inject, Injectable } from '@nestjs/common';
import { InvalidPayloadException } from '../exception/userauth.exception';
import User from '../../authorization/entity/user.entity';
import { GoogleUserSchema } from '../validation/user.auth.schema.validation';
import { UserServiceInterface } from '../../authorization/service/user.service.interface';
import { AuthenticationHelper } from '../authentication.helper';
import { GoogleLoginUser } from '../passport/googleStrategy';
import { TenantServiceInterface } from '../../tenant/service/tenant.service.interface';

@Injectable()
export class GoogleAuthService {
  constructor(
    @Inject(UserServiceInterface)
    private userService: UserServiceInterface,
    @Inject(TenantServiceInterface)
    private tenantService: TenantServiceInterface,
    private authenticationHelper: AuthenticationHelper,
  ) {}
  private async validateInput(
    googleLoginInput: GoogleLoginUser,
  ): Promise<GoogleLoginUser> {
    const { error } = GoogleUserSchema.validate(googleLoginInput);
    if (error) {
      throw new InvalidPayloadException(
        'Insufficient data from Google signin. '.concat(error.message),
      );
    }

    return googleLoginInput;
  }

  async googleLogin(googleLoginInput: GoogleLoginUser) {
    try {
      const googleUser = await this.validateInput(googleLoginInput);
      await this.tenantService.setTenantIdInContext(googleUser);

      let user = await this.userService.getUserDetailsByEmailOrPhone(
        googleUser.email,
      );
      if (!user) {
        user = await this.userService.createUser({
          ...new User(),
          ...googleLoginInput,
          origin: 'google',
        });
      }

      const token = this.authenticationHelper.generateTokenForUser(user);
      await this.userService.updateField(
        user.id,
        'refreshToken',
        token.refreshToken,
      );

      return token;
    } catch (error) {
      console.error('Google login failed:', error.message);
      throw new Error('Google login failed. Please try again.');
    }
  }
}
