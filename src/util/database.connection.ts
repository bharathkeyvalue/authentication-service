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
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
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
