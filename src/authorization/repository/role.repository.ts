import { Inject, Injectable } from '@nestjs/common';
import { UpdateRoleInput } from 'src/schema/graphql.schema';
import { DataSource, In } from 'typeorm';
import GroupRole from '../entity/groupRole.entity';
import Role from '../entity/role.entity';
import { BaseRepository } from './base.repository';
import { TENANT_CONNECTION } from '../../database/database.constants';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @Inject(TENANT_CONNECTION)
    private dataSource: DataSource,
  ) {
    super(Role, dataSource);
  }

  async getRoleById(id: string) {
    return this.findOneBy({ id });
  }

  async updateRoleById(id: string, role: UpdateRoleInput): Promise<boolean> {
    const updatedRole = await this.update(id, role);
    return updatedRole.affected !== 0;
  }

  async getRolesByIds(ids: string[]): Promise<Role[]> {
    return this.find({
      where: {
        id: In(ids),
      },
    });
  }

  async getRolesForGroupId(groupId: string): Promise<Role[]> {
    return this.createQueryBuilder('role')
      .leftJoinAndSelect(GroupRole, 'groupRole', 'role.id = groupRole.roleId')
      .where('groupRole.groupId = :groupId', { groupId })
      .getMany();
  }
}
