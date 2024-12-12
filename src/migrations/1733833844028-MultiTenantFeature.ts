import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiTenantFeature1733833844028 implements MigrationInterface {
  name = 'MultiTenantFeature1733833844028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tenant" ("deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "domain" character varying NOT NULL, CONSTRAINT "UQ_97b9c4dae58b30f5bd875f241ab" UNIQUE ("domain"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
    const tenants = await queryRunner.query(
      `INSERT INTO "tenant" ("name", "domain") VALUES ('Default Tenant', 'default.domain') RETURNING id`,
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
    await queryRunner.query(`
      ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "role" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "group" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "entity_model" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "user_group" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "user_permission" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "group_role" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "group_permission" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "role_permission" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "entity_permission" ENABLE ROW LEVEL SECURITY;
 
      CREATE POLICY tenant_isolation_policy ON "user" 
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "role"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "group"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "entity_model"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "user_group"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "user_permission"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "group_role"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "group_permission"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "role_permission"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      CREATE POLICY tenant_isolation_policy ON "entity_permission"
        USING (tenant_id = current_setting('app.tenant_id')::uuid);
      `);
    await queryRunner.query(`
      ALTER TABLE "entity_permission" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "group" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "group_permission" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "entity_model" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "role" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "group_role" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "role_permission" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "user" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "user_group" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
      ALTER TABLE "user_permission" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.tenant_id')::uuid;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_permission" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "user_group" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "user" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "role_permission" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "group_role" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "role" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "entity_model" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "group_permission" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "group" ALTER COLUMN "tenant_id" DROP DEFAULT;
      ALTER TABLE "entity_permission" ALTER COLUMN "tenant_id" DROP DEFAULT;
    `);
    await queryRunner.query(`
      DROP POLICY tenant_isolation_policy ON "user";
      DROP POLICY tenant_isolation_policy ON "role";
      DROP POLICY tenant_isolation_policy ON "group";
      DROP POLICY tenant_isolation_policy ON "entity_model";
      DROP POLICY tenant_isolation_policy ON "user_group";
      DROP POLICY tenant_isolation_policy ON "user_permission";
      DROP POLICY tenant_isolation_policy ON "group_role";
      DROP POLICY tenant_isolation_policy ON "group_permission";
      DROP POLICY tenant_isolation_policy ON "role_permission";
      DROP POLICY tenant_isolation_policy ON "entity_permission";
      ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "role" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "group" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "entity_model" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "user_group" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "user_permission" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "group_role" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "group_permission" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "role_permission" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "entity_permission" DISABLE ROW LEVEL SECURITY;
    `);
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
