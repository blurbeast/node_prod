import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class PlayerSaltMigration1746749941591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'players_salt',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        isUnique: true, 
                        generationStrategy: 'increment'
                    },
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
