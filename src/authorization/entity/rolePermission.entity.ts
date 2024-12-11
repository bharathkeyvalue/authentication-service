import { Entity, PrimaryColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
class RolePermission extends AbstractTenantEntity {
  @PrimaryColumn({ type: 'uuid' })
  public permissionId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public roleId!: string;
}

export default RolePermission;
