import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NewTenantInput } from '../../schema/graphql.schema';
import Tenant from '../entity/tenant.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthKeyGuard } from '../../authentication/authKey.guard';
import { TenantServiceInterface } from '../service/tenant.service.interface';

@Resolver('Tenant')
export class TenantResolver {
  constructor(
    @Inject(TenantServiceInterface)
    private tenantService: TenantServiceInterface,
  ) {}

  @UseGuards(AuthKeyGuard)
  @Mutation()
  async createTenant(
    @Args('input') tenantInput: NewTenantInput,
  ): Promise<Tenant> {
    return this.tenantService.createTenant(tenantInput);
  }
}
