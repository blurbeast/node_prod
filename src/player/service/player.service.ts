import { DataSource, Repository } from "typeorm";
import { CreatePlayerDto } from "../dtos/createPlayer.dto";
import { Player } from "../entities/player.entity";
import { PlayerSalt } from "../entities/salted.entity";
import { PermissionlessService } from "../../permissionless/permissionless.service";
import * as playerAbi from '../../permissionless/abis/player.abi.json';
import * as TokenAbi from '../../permissionless/abis/token.abi.json';
import { config } from 'dotenv';
import { LevelService } from "../../level/service/level.service";
import { formatUnits } from "viem";
config();

export class PlayerService {
    private readonly playerRepository: Repository<Player>;
    private readonly playerSaltedRepository: Repository<PlayerSalt>;
    private readonly permissionlessService: PermissionlessService;
    constructor(appDataSource: DataSource, private readonly levelService: LevelService) {
        this.playerRepository = appDataSource.getRepository(Player);
        this.playerSaltedRepository = appDataSource.getRepository(PlayerSalt);
        this.permissionlessService = new PermissionlessService();
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

            
        await contract.write.registerPlayer([
            newPlayer.playerSalt, newPlayer.smartAccountAddress
        ]);

        // create level for player 
        await this.levelService.createPlayerLevel(newPlayer.username);

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

        const playerTokenBalance = await tokenContract.read.balanceOf([player.smartAccountAddress]) as bigint;
        const decimals = await tokenContract.read.decimals([]) as number;

        return {
            username: player.username,
            tokenBalance: formatUnits(playerTokenBalance, decimals),
            smartAccountAddress: player.smartAccountAddress,
        };
    }
}