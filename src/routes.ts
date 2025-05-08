import express, { Router } from "express";
import { permissionlessController } from "./permissionless/permissionless.controller";


export class AppRouter {

    private readonly router: Router;
    private readonly permissionlessController: permissionlessController;

    constructor() {
        this.router = express.Router();
        this.permissionlessController = new permissionlessController();
    }

    setRouter() {

        this.router.get('/smart/:index', (req, res) => this.permissionlessController.createSmartAccount(req, res));
    }

    getRouter() {
        return this.router;
    }
}


const router = new AppRouter();
router.setRouter();
export default router.getRouter();