import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BaseRepository } from '../../authorization/repository/base.repository';
import Tenant from '../entity/tenant.entity';

@Injectable()
export class TenantRepository extends BaseRepository<Tenant> {
  constructor(private dataSource: DataSource) {
    super(Tenant, dataSource);
  }

  async getTenantByDomain(domain: string) {
    return this.findOneBy({ domain });
  }
}
