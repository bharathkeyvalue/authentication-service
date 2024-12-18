import { Inject, Injectable } from '@nestjs/common';
import User from '../../authorization/entity/user.entity';
import { UserNotFoundException } from '../../authorization/exception/user.exception';
import { UserServiceInterface } from '../../authorization/service/user.service.interface';
import {
  GenerateOtpInput,
  Status,
  TokenResponse,
  UserOTPLoginInput,
  UserOTPSignupInput,
  UserSignupResponse,
} from '../../schema/graphql.schema';
import {
  InvalidCredentialsException,
  UserExistsException,
} from '../exception/userauth.exception';
import { Authenticatable } from '../interfaces/authenticatable';
import { OTPVerifiable } from '../interfaces/otp.verifiable';
import { TokenService } from './token.service';
import { TenantServiceInterface } from '../../tenant/service/tenant.service.interface';

@Injectable()
export default class OTPAuthService implements Authenticatable {
  constructor(
    @Inject(UserServiceInterface)
    private userService: UserServiceInterface,
    @Inject(TenantServiceInterface)
    private tenantService: TenantServiceInterface,
    private tokenService: TokenService,
    private otpService: OTPVerifiable,
  ) {}

  async userSignup(
    userDetails: UserOTPSignupInput,
  ): Promise<UserSignupResponse> {
    await this.tenantService.setTenantIdInContext(userDetails);
    const verifyObj = await this.userService.verifyDuplicateUser(
      userDetails.email,
      userDetails.phone,
    );
    if (verifyObj.existingUserDetails) {
      throw new UserExistsException(
        verifyObj.existingUserDetails,
        verifyObj.duplicate,
      );
    }

    const userFromInput = new User();
    userFromInput.email = userDetails.email;
    userFromInput.phone = userDetails.phone;
    userFromInput.firstName = userDetails.firstName;
    userFromInput.middleName = userDetails.middleName;
    userFromInput.lastName = userDetails.lastName;
    userFromInput.status = Status.ACTIVE;

    return this.userService.createUser(userFromInput);
  }

  async userLogin(userDetails: UserOTPLoginInput): Promise<TokenResponse> {
    await this.tenantService.setTenantIdInContext(userDetails);
    const userRecord = await this.userService.getUserDetailsByUsername(
      userDetails.username,
      userDetails.username,
    );
    if (!userRecord) {
      throw new UserNotFoundException(userDetails.username);
    }
    const token = await this.loginWithOTP(
      userDetails.otp as string,
      userRecord,
    );
    if (!token) {
      throw new InvalidCredentialsException();
    }
    const tokenResponse: TokenResponse = { ...token, user: userRecord };
    return tokenResponse;
  }

  async sendOTP(generateOtpInput: GenerateOtpInput): Promise<void> {
    await this.tenantService.setTenantIdInContext(generateOtpInput);
    const user = await this.userService.getActiveUserByPhoneNumber(
      generateOtpInput.phone,
    );
    if (user && user.phone) {
      //Found an active user, generating OTP and sending the message to the user
      await this.otpService.sendOTP(user);
    } else {
      throw new UserNotFoundException(generateOtpInput.phone);
    }
  }

  private async loginWithOTP(otp: string, user: User) {
    const isValidCode = await this.otpService.validateOTP(otp, user);
    if (isValidCode) {
      return this.tokenService.getNewToken(user);
    }
  }
}
