import { Entity, PrimaryColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
class GroupRole extends AbstractTenantEntity {
  @PrimaryColumn({ type: 'uuid' })
  public roleId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public groupId!: string;
}

export default GroupRole;
