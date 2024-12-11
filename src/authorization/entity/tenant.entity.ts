import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import BaseEntity from './base.entity';

@Entity()
@Index('tenant_name_unique_idx', { synchronize: false })
class Tenant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;
}

export default Tenant;
