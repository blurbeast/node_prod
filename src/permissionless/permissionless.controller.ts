import { Request, Response } from "express";
import { PermissionlessService } from "./permissionless.service";



export class permissionlessController {

    private readonly permissionlessService: PermissionlessService;

    constructor() {
        this.permissionlessService = new PermissionlessService();
    }


    async createSmartAccount(req: Request, res: Response) {
        try{
            const result = await this.permissionlessService.account(Number(req.params.index));
            res.status(201).json(result);
        }catch(error) {
            res.status(400).json({ error: error});
        }
    }
}