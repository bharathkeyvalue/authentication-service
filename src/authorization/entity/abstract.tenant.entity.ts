import { Column } from 'typeorm';
import BaseEntity from './base.entity';

class AbstractTenantEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    default: () => "current_setting('app.tenant_id')::uuid",
  })
  public tenantId!: string;
}

export default AbstractTenantEntity;
