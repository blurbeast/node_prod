"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSaltMigration1746749941591 = void 0;
const typeorm_1 = require("typeorm");
class PlayerSaltMigration1746749941591 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }));
    }
    async down(queryRunner) {
    }
}
exports.PlayerSaltMigration1746749941591 = PlayerSaltMigration1746749941591;
