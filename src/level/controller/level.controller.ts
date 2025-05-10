import e, { Request, Response } from "express";
import { LevelService } from "../service/level.service";



export class LevelController {

    private readonly levelService: LevelService;

    constructor() {
        this.levelService = new LevelService();
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
}