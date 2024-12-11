import { PrimaryColumn } from 'typeorm';
import BaseEntity from './base.entity';

class AbstractTenantEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  public tenantId!: string;
}

export default AbstractTenantEntity;
