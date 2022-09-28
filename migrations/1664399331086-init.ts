import {MigrationInterface, QueryRunner} from "typeorm";

export class init1664399331086 implements MigrationInterface {
    name = 'init1664399331086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(300) NOT NULL, "passwordHash" character varying(300) NOT NULL, "name" character varying(300) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "polls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "_public" integer NOT NULL, "_default" integer NOT NULL, "title" character varying NOT NULL, "creatorId" uuid, "overwrittenBy" uuid, CONSTRAINT "REL_436f8885bd970ba03dfdd55251" UNIQUE ("overwrittenBy"), CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "orderNumber" integer NOT NULL, "pollId" uuid, CONSTRAINT "PK_31d5be3685b9e1f6a5f087ca47e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "orderNumber" integer NOT NULL, "sectionId" uuid, CONSTRAINT "PK_b72aec95331746de13fb5b62eeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_respondents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pollId" uuid, CONSTRAINT "PK_8f0dc7dae3f79d2193ab83af24e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_respondent_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "questionId" uuid, "respondentId" uuid, CONSTRAINT "PK_6c012a1c98b031f98da71276a99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_436f8885bd970ba03dfdd552514" FOREIGN KEY ("overwrittenBy") REFERENCES "polls"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_sections" ADD CONSTRAINT "FK_a49a02c06eca2f17b9620b5e8da" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_questions" ADD CONSTRAINT "FK_22c8b44e1b9400afec48da40c72" FOREIGN KEY ("sectionId") REFERENCES "poll_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_respondents" ADD CONSTRAINT "FK_b3f358ee46fce83651b4b758073" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_respondent_answers" ADD CONSTRAINT "FK_03d12496702047dba1fb962d8fa" FOREIGN KEY ("questionId") REFERENCES "poll_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_respondent_answers" ADD CONSTRAINT "FK_2783bab40668cd981d9dc040542" FOREIGN KEY ("respondentId") REFERENCES "poll_respondents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poll_respondent_answers" DROP CONSTRAINT "FK_2783bab40668cd981d9dc040542"`);
        await queryRunner.query(`ALTER TABLE "poll_respondent_answers" DROP CONSTRAINT "FK_03d12496702047dba1fb962d8fa"`);
        await queryRunner.query(`ALTER TABLE "poll_respondents" DROP CONSTRAINT "FK_b3f358ee46fce83651b4b758073"`);
        await queryRunner.query(`ALTER TABLE "poll_questions" DROP CONSTRAINT "FK_22c8b44e1b9400afec48da40c72"`);
        await queryRunner.query(`ALTER TABLE "poll_sections" DROP CONSTRAINT "FK_a49a02c06eca2f17b9620b5e8da"`);
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_436f8885bd970ba03dfdd552514"`);
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d"`);
        await queryRunner.query(`DROP TABLE "poll_respondent_answers"`);
        await queryRunner.query(`DROP TABLE "poll_respondents"`);
        await queryRunner.query(`DROP TABLE "poll_questions"`);
        await queryRunner.query(`DROP TABLE "poll_sections"`);
        await queryRunner.query(`DROP TABLE "polls"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
