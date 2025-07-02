import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCreateTables1751439098497 implements MigrationInterface {
  name = 'InitialCreateTables1751439098497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "salary" numeric(10,2) NOT NULL, "company_value" numeric(12,2) NOT NULL, "creator_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_clients" ("user_id" uuid NOT NULL, "client_id" uuid NOT NULL, CONSTRAINT "PK_04e047a4375832031896bb4d59d" PRIMARY KEY ("user_id", "client_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_clients" ADD CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_clients" ADD CONSTRAINT "FK_410f7c875e1b512ef6477a3baab" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_clients" DROP CONSTRAINT "FK_410f7c875e1b512ef6477a3baab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_clients" DROP CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "users_clients"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
