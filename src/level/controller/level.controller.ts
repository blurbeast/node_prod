import { Request, Response } from "express";
import { LevelService } from "../service/level.service";



export class LevelController {

    private readonly levelService: LevelService;

    constructor() {
        this.levelService = new LevelService();
    }

    

}