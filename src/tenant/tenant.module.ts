import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tenant from '../tenant/entity/tenant.entity';
import { TenantResolver } from '../tenant/resolver/tenant.resolver';
import TenantService from '../tenant/service/tenant.service';
import { TenantRepository } from '../tenant/repository/tenant.repository';
import { TenantServiceInterface } from '../tenant/service/tenant.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [
    ConfigService,
    TenantResolver,
    TenantRepository,
    {
      provide: TenantServiceInterface,
      useClass: TenantService,
    },
  ],
  exports: [
    {
      provide: TenantServiceInterface,
      useClass: TenantService,
    },
  ],
})
export class TenantModule {}
