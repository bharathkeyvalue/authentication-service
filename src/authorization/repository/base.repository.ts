import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
  QueryRunner,
  SaveOptions,
  DeepPartial,
} from 'typeorm';
import { getConnection } from '../../util/database.connection';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  private entityClass: any;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
    this.entityClass = entity;
  }

  protected async getDynamicRepository(): Promise<Repository<T>> {
    const connection = await getConnection();
    return connection.getRepository(this.entityClass.name);
  }

  async find(options?: any): Promise<T[]> {
    const repository = await this.getDynamicRepository();
    return repository.find(options);
  }

  async findOne(options: any): Promise<T | null> {
    const repository = await this.getDynamicRepository();
    return repository.findOne(options);
  }

  async findOneOrFail(options: any): Promise<T> {
    const repository = await this.getDynamicRepository();
    return repository.findOneOrFail(options);
  }

  async findOneBy(options: any): Promise<T | null> {
    const repository = await this.getDynamicRepository();
    return repository.findOneBy(options);
  }

  async update(criteria: any, partialEntity: any): Promise<any> {
    const repository = await this.getDynamicRepository();
    return repository.update(criteria, partialEntity);
  }

  async delete(criteria: any): Promise<any> {
    const repository = await this.getDynamicRepository();
    return repository.delete(criteria);
  }

  async softDelete(criteria: any): Promise<any> {
    const repository = await this.getDynamicRepository();
    return repository.softDelete(criteria);
  }

  async count(options?: any): Promise<number> {
    const repository = await this.getDynamicRepository();
    return repository.count(options);
  }

  async getQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): Promise<SelectQueryBuilder<T>> {
    const repository = await this.getDynamicRepository();
    return repository.createQueryBuilder(alias, queryRunner);
  }

  async save(entity: any, options?: SaveOptions): Promise<any> {
    const repository = await this.getDynamicRepository();
    return repository.save(entity, options);
  }
}
