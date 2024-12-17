import { Inject, Injectable } from '@nestjs/common';
import { UpdateEntityInput } from 'src/schema/graphql.schema';
import { DataSource } from 'typeorm';
import EntityModel from '../entity/entity.entity';
import { BaseRepository } from './base.repository';
import { TENANT_CONNECTION } from '../../database/database.constants';

@Injectable()
export class EntityModelRepository extends BaseRepository<EntityModel> {
  constructor(
    @Inject(TENANT_CONNECTION)
    private dataSource: DataSource,
  ) {
    super(EntityModel, dataSource);
  }

  async getAllEntities(): Promise<EntityModel[]> {
    return this.find();
  }

  async getEntityById(id: string) {
    return this.findOneBy({ id });
  }

  async updateEntityById(
    id: string,
    role: UpdateEntityInput,
  ): Promise<boolean> {
    const updatedEntity = await this.update(id, role);
    return updatedEntity.affected !== 0;
  }
}
