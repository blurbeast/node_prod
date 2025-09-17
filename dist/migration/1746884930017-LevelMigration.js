"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelMigration1746884930017 = void 0;
const typeorm_1 = require("typeorm");
class LevelMigration1746884930017 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }));
    }
    async down(queryRunner) {
    }
}
exports.LevelMigration1746884930017 = LevelMigration1746884930017;
