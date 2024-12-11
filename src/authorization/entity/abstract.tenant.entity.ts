import { Column } from 'typeorm';
import BaseEntity from './base.entity';

class AbstractTenantEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    default: () => "current_setting('app.current_tenant')",
  })
  public tenantId!: string;
}

export default AbstractTenantEntity;
