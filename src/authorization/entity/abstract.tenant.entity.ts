import { Column } from 'typeorm';
import BaseEntity from './base.entity';

class AbstractTenantEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  public tenantId!: string;
}

export default AbstractTenantEntity;
