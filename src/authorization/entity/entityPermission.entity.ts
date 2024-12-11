import { Entity, PrimaryColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
class EntityPermission extends AbstractTenantEntity {
  @PrimaryColumn({ type: 'uuid' })
  public permissionId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public entityId!: string;
}

export default EntityPermission;
