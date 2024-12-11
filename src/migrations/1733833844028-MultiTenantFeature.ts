import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiTenantFeature1733833844028 implements MigrationInterface {
  name = 'MultiTenantFeature1733833844028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tenant" ("deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
    const tenants = await queryRunner.query(
      `INSERT INTO "tenant" ("name") VALUES ('Default Tenant') RETURNING id`,
    );
    const tenantId = tenants[0].id;
    await queryRunner.query(
      `ALTER TABLE "entity_model" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(`ALTER TABLE "user_group" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "group_role" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "group_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "entity_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
