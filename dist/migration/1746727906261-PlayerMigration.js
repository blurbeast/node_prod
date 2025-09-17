"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMigration1746727906261 = void 0;
const typeorm_1 = require("typeorm");
class PlayerMigration1746727906261 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'players',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isGenerated: true,
                    isPrimary: true,
                    isUnique: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'username',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: 'smart_account_address',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'player_salt',
                    type: 'int',
                    isNullable: false,
                    isUnique: true
                }
            ]
        }));
    }
    async down(queryRunner) {
    }
}
exports.PlayerMigration1746727906261 = PlayerMigration1746727906261;
