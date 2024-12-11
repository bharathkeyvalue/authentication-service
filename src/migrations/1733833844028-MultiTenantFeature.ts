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
      `ALTER TABLE "entity_model" DROP CONSTRAINT "PK_ea7e5d0ca6a0d6221f78cea499a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" ADD CONSTRAINT "PK_8136db3bf8c7a328973a0feb096" PRIMARY KEY ("id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" DROP CONSTRAINT "PK_22d409e099ab8a6bc3fc7b7b8a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ADD CONSTRAINT "PK_456866ab8087e8d3a3d616dbe0a" PRIMARY KEY ("permission_id", "entity_id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "PK_3ba4cfb3cab75ac2ea4b0a9536b" PRIMARY KEY ("id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" DROP CONSTRAINT "PK_5aadf555f3ea93c95bc952f1547"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ADD CONSTRAINT "PK_97edbfb9e685755fa455480f98c" PRIMARY KEY ("permission_id", "group_id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" DROP CONSTRAINT "PK_34b9a049ae09a85e87e7f18787b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ADD CONSTRAINT "PK_3a8315bbdf7bfd962bf0e7a40e5" PRIMARY KEY ("role_id", "group_id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "PK_2b394366739f89a92b09a90aea4" PRIMARY KEY ("id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "PK_19a94c31d4960ded0dcd0397759"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "PK_96cb2e2da566ba65ae7f24cece2" PRIMARY KEY ("permission_id", "role_id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_9a56c21022d9a4dc056d9c37575" PRIMARY KEY ("id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" DROP CONSTRAINT "PK_bd332ba499e012f8d20905f8061"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD CONSTRAINT "PK_fe9b93596a9c69d45a04226cc40" PRIMARY KEY ("group_id", "user_id", "tenant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD "tenant_id" uuid NOT NULL DEFAULT '${tenantId}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ALTER COLUMN "tenant_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "PK_e55fe6295b438912cb42bce1baa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "PK_f63ef18a89058a5d95c171b7823" PRIMARY KEY ("permission_id", "user_id", "tenant_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "PK_f63ef18a89058a5d95c171b7823"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "PK_e55fe6295b438912cb42bce1baa" PRIMARY KEY ("permission_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" DROP CONSTRAINT "PK_fe9b93596a9c69d45a04226cc40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD CONSTRAINT "PK_bd332ba499e012f8d20905f8061" PRIMARY KEY ("group_id", "user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "user_group" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_9a56c21022d9a4dc056d9c37575"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "PK_96cb2e2da566ba65ae7f24cece2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("permission_id", "role_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "PK_2b394366739f89a92b09a90aea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "group_role" DROP CONSTRAINT "PK_3a8315bbdf7bfd962bf0e7a40e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_role" ADD CONSTRAINT "PK_34b9a049ae09a85e87e7f18787b" PRIMARY KEY ("role_id", "group_id")`,
    );
    await queryRunner.query(`ALTER TABLE "group_role" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "group_permission" DROP CONSTRAINT "PK_97edbfb9e685755fa455480f98c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" ADD CONSTRAINT "PK_5aadf555f3ea93c95bc952f1547" PRIMARY KEY ("permission_id", "group_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "PK_3ba4cfb3cab75ac2ea4b0a9536b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "entity_permission" DROP CONSTRAINT "PK_456866ab8087e8d3a3d616dbe0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" ADD CONSTRAINT "PK_22d409e099ab8a6bc3fc7b7b8a1" PRIMARY KEY ("permission_id", "entity_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_permission" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" DROP CONSTRAINT "PK_8136db3bf8c7a328973a0feb096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" ADD CONSTRAINT "PK_ea7e5d0ca6a0d6221f78cea499a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "entity_model" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
