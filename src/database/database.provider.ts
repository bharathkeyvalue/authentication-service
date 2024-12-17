import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, getConnectionManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ExecutionManager } from '../util/execution.manager';
import { TENANT_CONNECTION } from './database.constants';
import { LoggerService } from 'src/logger/logger.service';

export const databaseProvider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async () => {
    const tenantId = ExecutionManager.getTenantId();

    if (getConnectionManager().has(tenantId)) {
      const con = getConnectionManager().get(tenantId);
      const existingConnection = await Promise.resolve(
        con.isConnected ? con : con.connect(),
      );
      await switchToTenant(tenantId, existingConnection);

      return existingConnection;
    }

    const newConnection: DataSource = await new DataSource({
      name: tenantId,
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_TENANT_USER,
      password: process.env.POSTGRES_TENANT_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        __dirname + '/../**/*.entity.ts',
        __dirname + '/../**/*.entity.js',
      ],
      synchronize: false,
      logging: ['error'],
      namingStrategy: new SnakeNamingStrategy(),
      ...(process.env.POSTGRES_TENANT_MAX_CONNECTION_LIMIT
        ? { extra: { max: process.env.POSTGRES_TENANT_MAX_CONNECTION_LIMIT } }
        : {}),
    }).initialize();

    await switchToTenant(tenantId, newConnection);

    return newConnection;
  },
  inject: [REQUEST],
};

const switchToTenant = async (
  tenantId: string,
  connection: DataSource,
): Promise<void> => {
  try {
    await connection.query(`select set_config('app.tenant_id', $1, false)`, [
      tenantId,
    ]);
  } catch (error) {
    const logger = LoggerService.getInstance('bootstrap()');
    logger.error(
      `Failed to switch to tenant: ${tenantId}, error: ${JSON.stringify(
        error,
      )}]`,
    );
  }
};
