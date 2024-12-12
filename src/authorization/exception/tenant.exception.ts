import { NotFoundException } from '@nestjs/common';

export class TenantNotFoundException extends NotFoundException {
  constructor(tenantDomain: string) {
    super(`Tenant with domain ${tenantDomain} not found`);
  }
}
