import express, { Request, Response, Router } from "express";
import { PlayerController } from "./player/controller/player.controller";
import { LevelController } from "./level/controller/level.controller";
import { LevelService } from "./level/service/level.service";
import { PlayerService } from "./player/service/player.service";
import { appDataSource } from ".";


export class AppRouter {

    private readonly router: Router;
    private readonly playerController: PlayerController;
    private readonly levelController: LevelController;

    constructor() {
        this.router = express.Router();
        const levelService: LevelService = new LevelService(appDataSource);
        const playerService: PlayerService = new PlayerService(appDataSource, levelService);
        this.playerController = new PlayerController(playerService);
        this.levelController = new LevelController(levelService);
        this.setRouter();
    }

    setRouter() {
        // this.router.get('/smart/:index', (req, res) => this.permissionlessController.createSmartAccount(req, res));
        // player
        this.router.post('/player', (req: Request, res: Response) => this.playerController.createPlayer(req, res));
        this.router.get('/player/:username', (req: Request, res: Response) => this.playerController.getPlayer(req, res));

        // level
        this.router.post('/level/:username/:score', (req: Request, res: Response) => this.levelController.addPlayerScore(req, res));
        this.router.get('/level/top/', (req: Request, res: Response) => this.levelController.getTopNLevel(req, res));
        this.router.get('/level/paginate', (req: Request, res: Response) => this.levelController.getLevelPagination(req, res));
        this.router.get('/level/:username', (req: Request, res: Response) => this.levelController.getPlayerLevelScore(req, res));
    }

    getRouter() {
        return this.router;
    }
}