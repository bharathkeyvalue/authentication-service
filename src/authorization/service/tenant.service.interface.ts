import { NewTenantInput } from 'src/schema/graphql.schema';
import Tenant from '../entity/tenant.entity';

export interface TenantServiceInterface {
  getTenantByDomain(domain: string): Promise<Tenant>;

  createTenant(tenant: NewTenantInput): Promise<Tenant>;
}

export const TenantServiceInterface = Symbol('TenantServiceInterface');
