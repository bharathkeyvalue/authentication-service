import { Inject, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import Group from '../entity/group.entity';
import UserGroup from '../entity/userGroup.entity';
import { BaseRepository } from './base.repository';
import { TENANT_CONNECTION } from '../../database/database.constants';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(
    @Inject(TENANT_CONNECTION)
    private dataSource: DataSource,
  ) {
    super(Group, dataSource);
  }

  async getGroupById(id: string) {
    return this.findOneBy({ id });
  }

  async updateGroupById(id: string, name?: string): Promise<boolean> {
    const result = await this.update(id, { name });

    return result.affected === 1;
  }

  async getGroupsByIds(ids: string[]) {
    return this.find({
      where: {
        id: In(ids),
      },
    });
  }

  async getGroupsForUserId(userId: string): Promise<Group[]> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect(UserGroup, 'userGroup', 'group.id = userGroup.groupId')
      .where('userGroup.userId = :userId', { userId })
      .getMany();
  }
}
