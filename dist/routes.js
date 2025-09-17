"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRouter = void 0;
const express_1 = __importDefault(require("express"));
const player_controller_1 = require("./player/controller/player.controller");
const level_controller_1 = require("./level/controller/level.controller");
const level_service_1 = require("./level/service/level.service");
const player_service_1 = require("./player/service/player.service");
const _1 = require(".");
class AppRouter {
    router;
    playerController;
    levelController;
    constructor() {
        this.router = express_1.default.Router();
        const levelService = new level_service_1.LevelService(_1.appDataSource);
        const playerService = new player_service_1.PlayerService(_1.appDataSource, levelService);
        this.playerController = new player_controller_1.PlayerController(playerService);
        this.levelController = new level_controller_1.LevelController(levelService);
        this.setRouter();
    }
    setRouter() {
        // this.router.get('/smart/:index', (req, res) => this.permissionlessController.createSmartAccount(req, res));
        // player
        this.router.post('/player', (req, res) => this.playerController.createPlayer(req, res));
        this.router.get('/player/:username', (req, res) => this.playerController.getPlayer(req, res));
        // level
        this.router.post('/level/:username/:score', (req, res) => this.levelController.addPlayerScore(req, res));
        this.router.get('/level/top/', (req, res) => this.levelController.getTopNLevel(req, res));
        this.router.get('/level/paginate', (req, res) => this.levelController.getLevelPagination(req, res));
        this.router.get('/level/:username', (req, res) => this.levelController.getPlayerLevelScore(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.AppRouter = AppRouter;
