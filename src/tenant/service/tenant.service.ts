import { Injectable } from '@nestjs/common';

import Tenant from '../entity/tenant.entity';
import { TenantNotFoundException } from '../exception/tenant.exception';
import { TenantRepository } from '../repository/tenant.repository';
import { NewTenantInput } from '../../schema/graphql.schema';
import { ConfigService } from '@nestjs/config';
import { ExecutionManager } from '../../util/execution.manager';
import { TenantServiceInterface } from './tenant.service.interface';

@Injectable()
export default class TenantService implements TenantServiceInterface {
  private readonly multiTenancyEnabled: boolean;
  private readonly defaultTenantId: string;
  constructor(
    private tenantRepository: TenantRepository,
    private configService: ConfigService,
  ) {
    this.multiTenancyEnabled =
      this.configService.get('MULTI_TENANCY_ENABLED') === 'true';
    this.defaultTenantId = this.configService.get(
      'DEFAULT_TENANT_ID',
    ) as string;
  }

  async getTenantByDomain(domain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.getTenantByDomain(domain);
    if (!tenant) {
      throw new TenantNotFoundException(domain);
    }
    return tenant;
  }

  async createTenant(tenant: NewTenantInput): Promise<Tenant> {
    return this.tenantRepository.save(tenant);
  }

  async setTenantIdInContext(userDetails: any): Promise<void> {
    let tenantId: string;
    if (this.multiTenancyEnabled) {
      const domain =
        userDetails.tenantDomain ||
        userDetails.email?.split('@')[1] ||
        userDetails.username?.split('@')[1];
      const tenant = userDetails.tenantId
        ? { id: userDetails.tenantId }
        : await this.getTenantByDomain(domain);
      tenantId = tenant.id;
    } else {
      tenantId = this.defaultTenantId;
    }
    ExecutionManager.setTenantId(tenantId);
  }
}
