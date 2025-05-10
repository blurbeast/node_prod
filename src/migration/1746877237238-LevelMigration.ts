import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class LevelMigration1746877237238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'level',
                columns: [
                    {
                        name: 'id',
                        isPrimary: true,
                        type: 'int',
                        isGenerated: true,
                        isUnique: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'player_user_name',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'player_score',
                        type: 'int',
                        default: 0
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
