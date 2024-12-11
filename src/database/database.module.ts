import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ExecutionManager } from '../util/execution.manager';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          __dirname + '/../**/*.entity.ts',
          __dirname + '/../**/*.entity.js',
        ],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        logging: true,
        extra: {
          poolMiddleware: async (query: string, params: any[]) => {
            const tenantId = ExecutionManager.getTenantId();
            if (tenantId) {
              return [
                `SELECT set_config('app.tenant_id', ${tenantId}, false) ${query}`,
                params,
              ];
            }
            return [query, params];
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
