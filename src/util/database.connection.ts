import { getConnectionManager, DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { LoggerService } from '../logger/logger.service';
import { ExecutionManager } from './execution.manager';

/**
 * Get connection based on the logged in tenant
 * @returns connection
 */

export async function getConnection(): Promise<DataSource> {
  const tenantName = ExecutionManager.getTenantId();
  return getConnectionForTenant(tenantName);
}

export async function getConnectionForTenant(
  tenantId: string,
): Promise<DataSource> {
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
}

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

export async function getConnectionAsOwner(): Promise<DataSource> {
  if (!getConnectionManager().has('Owner'))
    return await new DataSource({
      name: 'Owner',
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_ADMIN_USER,
      password: process.env.POSTGRES_ADMIN_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
      logging: ['error'],
      namingStrategy: new SnakeNamingStrategy(),
      migrationsTableName: 'migrations',
      migrations: [__dirname + '/../migrations/*.js'],
      ...(process.env.POSTGRES_ADMIN_MAX_CONNECTION_LIMIT
        ? { extra: { max: process.env.POSTGRES_ADMIN_MAX_CONNECTION_LIMIT } }
        : {}),
    }).initialize();
  const con = getConnectionManager().get('Owner');
  const existingConnection = await Promise.resolve(
    con.isConnected ? con : con.connect(),
  );
  return existingConnection;
}
