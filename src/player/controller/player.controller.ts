import { PlayerService } from "../service/player.service";



export class PlayerController {
    private readonly playerService: PlayerService;
    constructor() {
        this.playerService = new PlayerService();
    }
}