import { Repository } from "typeorm";
import { CreatePlayerDto } from "../dtos/createPlayer.dto";
import { Player } from "../entities/player.entity";
import { appDataSource } from "../..";
import { PlayerSalt } from "../entities/salted.entity";
import { PermissionlessService } from "../../permissionless/permissionless.service";
import * as playerAbi from '../../permissionless/abis/player.abi.json';
import * as TokenAbi from '../../permissionless/abis/token.abi.json';
import { config } from 'dotenv';
import { LevelService } from "../../level/service/level.service";
config();

export class PlayerService {
    private readonly playerRepository: Repository<Player>;
    private readonly playerSaltedRepository: Repository<PlayerSalt>;
    private readonly permissionlessService: PermissionlessService;
    private readonly levelService: LevelService;
    constructor() {
        this.playerRepository = appDataSource.getRepository(Player);
        this.playerSaltedRepository = appDataSource.getRepository(PlayerSalt);
        this.permissionlessService = new PermissionlessService();
        this.levelService = new LevelService();
    }


    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<any> {
        // check if the user name exist
        const player: Player | null = await this.playerRepository.findOne({ where: {
            username: createPlayerDto.username.toLocaleLowerCase(),
        }});

        if(player) {
            throw new Error(`player with the username ${createPlayerDto.username} already exist`);
        }

        // get the salt for the player 
        let playerSalt: PlayerSalt | null = await this.playerSaltedRepository.findOne({
            where: { id: 1 }
        });


        if (!playerSalt) {
            playerSalt = new PlayerSalt();
            playerSalt.salt = 1;
            await this.playerSaltedRepository.save(playerSalt);
        }

        // call the permissionless service
        const smartAddress: string = await this.permissionlessService.account(playerSalt.salt);

        // now create the player 
        const newPlayer = new Player();
        newPlayer.playerSalt = playerSalt.salt;
        newPlayer.username = createPlayerDto.username.toLocaleLowerCase();
        newPlayer.smartAccountAddress = smartAddress;

        // save player on chain 
        const contract = await this.permissionlessService.getContractInstance(
            process.env.GAME_CONTRACT as string ,playerAbi.abi);

        // create level for player 
        await this.levelService.createPlayerLevel(newPlayer.username);

        await contract.write.registerPlayer([
            newPlayer.playerSalt, newPlayer.smartAccountAddress
        ]);

        const savedPlayer: Player = await this.playerRepository.save(newPlayer);

        // update the salted 
        playerSalt.salt += 1;
        await this.playerSaltedRepository.save(playerSalt);

        return {
            username: savedPlayer.username,
            smartAddress: savedPlayer.smartAccountAddress
        }
    }

    async getPlayer(username: string) {
        const player: Player | null = await this.playerRepository.findOne({
            where: { username: username}
        });

        if(!player) {
            throw new Error(`could not locate player with the username ${username}`);
        }

        // get player token balance 
        const tokenContract = await this.permissionlessService.getContractInstance(
            process.env.TOKEN_CONTRACT as string , TokenAbi.abi
        );

        // const playerTokenBalance = await tokenContract.read.balanceOf([player.smartAccountAddress]);

        return {
            username: player.username,
            // tokenBalance: playerTokenBalance as string,
            smartAccountAddress: player.smartAccountAddress
        }
    }
}