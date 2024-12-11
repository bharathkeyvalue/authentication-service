import { Entity, PrimaryColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
class GroupPermission extends AbstractTenantEntity {
  @PrimaryColumn({ type: 'uuid' })
  public permissionId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public groupId!: string;
}

export default GroupPermission;
