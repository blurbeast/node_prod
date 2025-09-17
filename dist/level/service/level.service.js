"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelService = void 0;
const level_entity_1 = require("../entity/level.entity");
class LevelService {
    levelRepository;
    constructor(appDataSource) {
        this.levelRepository = appDataSource.getRepository(level_entity_1.Level);
    }
    async createPlayerLevel(playerUsername) {
        // get the level out 
        const playerLevel = await this.levelRepository.findOne({
            where: { playerUsername: playerUsername.toLowerCase() }
        });
        if (playerLevel) {
            throw new Error(`a player with the specified username already exist`);
        }
        const newPlayerLevel = new level_entity_1.Level();
        newPlayerLevel.playerUsername = playerUsername.toLowerCase();
        await this.levelRepository.save(newPlayerLevel);
    }
    async addPlayerScore(username, score) {
        // get the player level
        const playerLevel = await this.levelRepository.findOne({
            where: { playerUsername: username }
        });
        if (!playerLevel) {
            throw new Error(`could not locate player level with the specified username ? ${username}`);
        }
        playerLevel.playerScore += score;
        // save or update the player level 
        await this.levelRepository.save(playerLevel);
        return 'succesfully updated player score';
    }
    async getPlayerLevelScore(username) {
        const playerLevel = this.returnLevelsQuery();
        return playerLevel.where("level.player_user_name = :username", { username })
            .getRawOne();
    }
    async getTopNPlayerLevel(limit) {
        // if (!Number
        return await this.returnLevelsQuery()
            .orderBy('"player_score"', 'DESC')
            .limit(limit)
            .getRawMany();
    }
    async getPlayersLevelsPagination(limit, offset) {
        return await this.returnLevelsQuery()
            .orderBy('"player_score"', 'DESC')
            .limit(limit)
            .offset(offset)
            .getRawMany();
    }
    returnLevelsQuery() {
        return this.levelRepository
            .createQueryBuilder('level')
            .select([
            'level.player_user_name AS playerUsername',
            'level.player_score AS playerScore',
            'DENSE_RANK() OVER (ORDER BY level.player_score DESC) AS rank',
        ]);
    }
}
exports.LevelService = LevelService;
