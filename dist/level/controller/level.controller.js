"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelController = void 0;
class LevelController {
    levelService;
    constructor(levelService) {
        this.levelService = levelService;
    }
    async addPlayerScore(req, res) {
        try {
            const username = req.params.username;
            const score = req.params.score;
            const result = await this.levelService.addPlayerScore(username, Number(score));
            res.status(200).json(result);
        }
        catch (error) {
            const err = error instanceof Error ?
                error.message : 'level controller: could not determine the error ';
            res.status(401).json(err);
        }
    }
    async getPlayerLevelScore(req, res) {
        try {
            const username = req.params.username;
            const result = await this.levelService.getPlayerLevelScore(username);
            res.status(200).json(result);
        }
        catch (error) {
            const err = error instanceof Error ?
                error.message : 'level controller: could not determine the error ';
            res.status(401).json(err);
        }
    }
    async getTopNLevel(req, res) {
        try {
            const limit = parseInt((req.query.limit));
            const response = await this.levelService.getTopNPlayerLevel(limit);
            res.status(200).json(response);
        }
        catch (error) {
            const result = error instanceof Error ? error.message : 'level error: could not tell the error';
            res.status(400).json(result);
        }
    }
    async getLevelPagination(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset);
            const response = await this.levelService.getPlayersLevelsPagination(limit, offset);
            res.status(200).json(response);
        }
        catch (error) {
            const result = error instanceof Error ? error.message : 'level error: could not tell the error';
            res.status(400).json(result);
        }
    }
}
exports.LevelController = LevelController;
