import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class PlayerSaltMigration1746728405730 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'players_salt',
                columns: [
                    {
                        name: 'salt',
                        type: 'int'
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
