import { Injectable } from '@nestjs/common';

import Tenant from '../entity/tenant.entity';
import { TenantNotFoundException } from '../exception/tenant.exception';
import { TenantRepository } from '../repository/tenant.repository';
import { NewTenantInput } from '../../schema/graphql.schema';
import { TenantServiceInterface } from './tenant.service.interface';

@Injectable()
export default class TenantService implements TenantServiceInterface {
  constructor(private tenantRepository: TenantRepository) {}

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
}
