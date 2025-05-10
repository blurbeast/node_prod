import e, { Request, Response } from "express";
import { LevelService } from "../service/level.service";

export class LevelController {

    constructor(private readonly levelService: LevelService) {
    }

    async addPlayerScore(req: Request, res: Response) {
        try{
            const username = req.params.username;
            const score = req.params.score;
        
            const result = await this.levelService.addPlayerScore(username, Number(score));

            res.status(200).json(result);

        }catch(error) {
            const err = error instanceof Error ?
             error.message : 'level controller: could not determine the error ';
            res.status(401).json(err);
        }
    }


    async getPlayerLevelScore(req: Request, res: Response) {
        try{
            const username = req.params.username;
            const result = await this.levelService.getPlayerLevelScore(username);
            res.status(200).json(result); 
        }catch(error) {
            const err = error instanceof Error ?
             error.message : 'level controller: could not determine the error ';
            res.status(401).json(err);
        }
    }

    async getTopNLevel(req: Request, res: Response) {
        try {
            const limit = req.query.limit;
            const response = await this.levelService.getTopNPlayerLevel(Number(limit));
            res.status(200).json(response);
        }catch(error) {
            const result = error instanceof Error ? error.message : 'level error: could not tell the error';
            res.status(400).json(result);
        }
    }

    async getLevelPagination(req: Request, res: Response) {
        try{
            const limit = Number(req.query.limit);
            const offset = Number(req.query.offset);
            const response = await this.levelService.getPlayersLevelsPagination(limit, offset);
            res.status(200).json(response);
        }catch(error) {
            const result = error instanceof Error ? error.message : 'level error: could not tell the error';
            res.status(400).json(result);
        }
    }
}