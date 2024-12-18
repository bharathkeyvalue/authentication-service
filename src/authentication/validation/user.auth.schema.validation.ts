import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
dotenv.config();

const multiTenancyEnabled = Boolean(process.env.MULTI_TENANCY_ENABLED);

export const UserPasswordSignupInputSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.number(),
  password: Joi.string().required().min(10),
  firstName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  middleName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .allow('', null),
  lastName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  tenantDomain: Joi.string().when('email', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: multiTenancyEnabled
      ? Joi.string().required()
      : Joi.string().optional(),
  }),
})
  .options({ abortEarly: false })
  .or('email', 'phone');

export const UserOTPSignupInputSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.number().required(),
  firstName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  middleName: Joi.string().regex(/^[a-zA-Z ]*$/),
  lastName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  tenantDomain: Joi.string().when('email', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: multiTenancyEnabled
      ? Joi.string().required()
      : Joi.string().optional(),
  }),
}).options({ abortEarly: false });

export const UserPasswordLoginInputSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(10).required(),
  tenantDomain: multiTenancyEnabled
    ? Joi.string().required()
    : Joi.string().optional(),
}).options({ abortEarly: false });

export const UserOTPLoginInputSchema = Joi.object({
  username: Joi.string().required(),
  otp: Joi.string().required(),
  tenantDomain: multiTenancyEnabled
    ? Joi.string().required()
    : Joi.string().optional(),
}).options({ abortEarly: false });

export const UserSendOTPInputSchema = Joi.object({
  username: Joi.string().required(),
}).options({ abortEarly: false });

export const UserPasswordInputSchema = Joi.object({
  currentPassword: Joi.string().required().min(10),
  newPassword: Joi.string()
    .disallow(Joi.ref('currentPassword'))
    .required()
    .min(10),
}).options({ abortEarly: false });

export const GoogleUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  firstName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  middleName: Joi.string().regex(/^[a-zA-Z ]*$/),
  lastName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  externalUserId: Joi.string().required(),
}).options({ abortEarly: false });

export const GenerateOtpInputSchema = Joi.object({
  phone: Joi.string().trim().required(),
  tenantDomain: multiTenancyEnabled
    ? Joi.string().required()
    : Joi.string().optional(),
});

export const Enable2FAInputSchema = Joi.object({
  code: Joi.string().trim().required(),
});

export const EnableUser2FASchema = Joi.object({
  phone: Joi.string().trim(),
  email: Joi.string().trim(),
}).xor('phone', 'email');

export const UserInviteTokenSignupInputSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.number(),
  firstName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
  middleName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .allow('', null),
  lastName: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .required(),
})
  .options({ abortEarly: false })
  .or('email', 'phone');

export const UserPasswordForInviteInputSchema = Joi.object({
  inviteToken: Joi.string().required(),
  password: Joi.string().required().min(10),
}).options({ abortEarly: false });
