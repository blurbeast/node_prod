"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
class PlayerController {
    playerService;
    constructor(playerService) {
        this.playerService = playerService;
    }
    async createPlayer(req, res) {
        try {
            const result = await this.playerService.createPlayer(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : ' could not figure the problem'
            });
        }
    }
    async getPlayer(req, res) {
        try {
            const response = await this.playerService.getPlayer(req.params.username);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(401).json({
                error: error instanceof Error ? error.message : 'could not get user '
            });
        }
    }
}
exports.PlayerController = PlayerController;
