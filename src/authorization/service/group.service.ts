import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NewGroupInput,
  UpdateGroupInput,
  UpdateGroupPermissionInput,
} from 'src/schema/graphql.schema';
import { Repository } from 'typeorm';
import Group from '../entity/group.entity';
import GroupPermission from '../entity/groupPermission.entity';
import Permission from '../entity/permission.entity';
import { GroupNotFoundException } from '../exception/group.exception';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(GroupPermission)
    private groupPermissionRepository: Repository<GroupPermission>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  getAllGroups(): Promise<Group[]> {
    return this.groupsRepository.find({ where: { active: true } });
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne(id, {
      where: { active: true },
    });
    if (group) {
      return group;
    }
    throw new GroupNotFoundException(id);
  }

  async createGroup(group: NewGroupInput): Promise<Group> {
    const newGroup = await this.groupsRepository.create(group);
    await this.groupsRepository.save(newGroup);
    return newGroup;
  }

  async updateGroup(id: string, group: UpdateGroupInput): Promise<Group> {
    await this.groupsRepository.update(id, group);
    const updatedGroup = await this.groupsRepository.findOne(id);
    if (updatedGroup) {
      return updatedGroup;
    }
    throw new GroupNotFoundException(id);
  }

  async deleteGroup(id: string): Promise<Group> {
    await this.groupsRepository.update(id, { active: false });
    const deletedGroup = await this.groupsRepository.findOne(id);
    if (deletedGroup) {
      return deletedGroup;
    }
    throw new GroupNotFoundException(id);
  }

  async updateGroupPermissions(
    id: string,
    request: UpdateGroupPermissionInput,
  ): Promise<Permission[]> {
    const updatedGroup = await this.groupsRepository.findOne(id);
    if (!updatedGroup) {
      throw new GroupNotFoundException(id);
    }
    const groupPermission = this.groupPermissionRepository.create(
      request.permissions.map((permission) => ({
        groupId: id,
        permissionId: permission,
      })),
    );
    const savedGroupPermissions = await this.groupPermissionRepository.save(
      groupPermission,
    );
    const permissions = this.permissionRepository.findByIds(
      savedGroupPermissions.map((g) => g.permissionId),
    );
    return permissions;
  }
}
