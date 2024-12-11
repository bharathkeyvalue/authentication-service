import { Entity, PrimaryColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
class UserGroup extends AbstractTenantEntity {
  @PrimaryColumn({ type: 'uuid' })
  public groupId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public userId!: string;
}

export default UserGroup;
