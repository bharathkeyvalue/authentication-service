import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import AbstractTenantEntity from './abstract.tenant.entity';

@Entity()
@Index('role_name_unique_idx', { synchronize: false })
class Role extends AbstractTenantEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;
}

export default Role;
