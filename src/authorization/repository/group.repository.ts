import { Injectable } from '@nestjs/common';
import { UpdateGroupInput } from 'src/schema/graphql.schema';
import { DataSource, In } from 'typeorm';
import Group from '../entity/group.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource);
  }

  async getGroupById(id: string) {
    return this.findOneBy({ id });
  }

  async updateGroupById(
    id: string,
    updateGroupInput: UpdateGroupInput,
  ): Promise<Boolean> {
    const result = await this.update({ id }, updateGroupInput);

    return result.affected === 1;
  }

  async getGroupsByIds(ids: string[]) {
    return this.find({
      where: {
        id: In(ids),
      },
    });
  }
}