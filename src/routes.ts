import express, { Request, Response, Router } from "express";
// import { permissionlessController } from "./permissionless/permissionless.controller";
import { PlayerController } from "./player/controller/player.controller";
import { LevelController } from "./level/controller/level.controller";


export class AppRouter {

    private readonly router: Router;
    // private readonly permissionlessController: permissionlessController;
    private readonly playerController: PlayerController;
    private readonly levelController: LevelController;

    constructor() {
        this.router = express.Router();
        // this.permissionlessController = new permissionlessController();
        this.playerController = new PlayerController();
        this.levelController = new LevelController();
        this.setRouter();
    }

    setRouter() {
        // this.router.get('/smart/:index', (req, res) => this.permissionlessController.createSmartAccount(req, res));
        // player
        this.router.post('/player', (req: Request, res: Response) => this.playerController.createPlayer(req, res));
        this.router.get('/player', (req: Request, res: Response) => this.playerController.getPlayer(req, res));

        // level
        this.router.post('/player/:username/:score', (req: Request, res: Response) => this.levelController.addPlayerScore(req, res));
    }

    getRouter() {
        return this.router;
    }
}
