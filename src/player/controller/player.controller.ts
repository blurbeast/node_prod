import { Request, Response } from "express";
import { PlayerService } from "../service/player.service";

export class PlayerController {
    private readonly playerService: PlayerService;
    constructor() {
        this.playerService = new PlayerService();
    }

    async createPlayer(req: Request, res: Response) {
        try{
            const result = await this.playerService.createPlayer(req.body);
            res.status(201).json(result);
        }catch(error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : ' could not figure the problem'
            });
        }
    }

    async getPlayer(req: Request, res: Response) {
        try{
            const response = await this.playerService.getPlayer(req.query.username as string);
            res.status(200).json(response);
        }catch(error) {
            res.status(401).json({
                error: error instanceof Error? error.message : 'could not get user '
            });
        }
    }
}