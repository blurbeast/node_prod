import { MigrationInterface, QueryRunner, Table } from "typeorm";


export class EntitiesMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                    },
                    {
                        name: 'user_address',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'smart_account_address',
                        type: 'varchar',
                        length: '42',
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }
}