import express, { Request, Response, Router } from "express";
import { permissionlessController } from "./permissionless/permissionless.controller";
import { PlayerController } from "./player/controller/player.controller";


export class AppRouter {

    private readonly router: Router;
    private readonly permissionlessController: permissionlessController;
    private readonly playerController: PlayerController;

    constructor() {
        this.router = express.Router();
        this.permissionlessController = new permissionlessController();
        this.playerController = new PlayerController();
        this.setRouter();
    }

    setRouter() {
        this.router.get('/smart/:index', (req, res) => this.permissionlessController.createSmartAccount(req, res));
        this.router.post('/player', (req: Request, res: Response) => this.playerController.createPlayer(req, res));
        this.router.get('/player', (req: Request, res: Response) => this.playerController.getPlayers(req, res));
    }

    getRouter() {
        return this.router;
    }
}
