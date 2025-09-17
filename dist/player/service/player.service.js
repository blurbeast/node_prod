"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const player_entity_1 = require("../entities/player.entity");
const salted_entity_1 = require("../entities/salted.entity");
const permissionless_service_1 = require("../../permissionless/permissionless.service");
const playerAbi = __importStar(require("../../permissionless/abis/player.abi.json"));
const TokenAbi = __importStar(require("../../permissionless/abis/token.abi.json"));
const dotenv_1 = require("dotenv");
const viem_1 = require("viem");
(0, dotenv_1.config)();
class PlayerService {
    levelService;
    playerRepository;
    playerSaltedRepository;
    permissionlessService;
    constructor(appDataSource, levelService) {
        this.levelService = levelService;
        this.playerRepository = appDataSource.getRepository(player_entity_1.Player);
        this.playerSaltedRepository = appDataSource.getRepository(salted_entity_1.PlayerSalt);
        this.permissionlessService = new permissionless_service_1.PermissionlessService();
    }
    async createPlayer(createPlayerDto) {
        // check if the user name exist
        const player = await this.playerRepository.findOne({ where: {
                username: createPlayerDto.username.toLocaleLowerCase(),
            } });
        if (player) {
            throw new Error(`player with the username ${createPlayerDto.username} already exist`);
        }
        // get the salt for the player 
        let playerSalt = await this.playerSaltedRepository.findOne({
            where: { id: 1 }
        });
        if (!playerSalt) {
            playerSalt = new salted_entity_1.PlayerSalt();
            playerSalt.salt = 1;
            await this.playerSaltedRepository.save(playerSalt);
        }
        // call the permissionless service
        const smartAddress = await this.permissionlessService.account(playerSalt.salt);
        // now create the player 
        const newPlayer = new player_entity_1.Player();
        newPlayer.playerSalt = playerSalt.salt;
        newPlayer.username = createPlayerDto.username.toLocaleLowerCase();
        newPlayer.smartAccountAddress = smartAddress;
        // save player on chain 
        const contract = await this.permissionlessService.getContractInstance(process.env.GAME_CONTRACT, playerAbi.abi);
        await contract.write.registerPlayer([
            newPlayer.playerSalt, newPlayer.smartAccountAddress
        ]);
        // create level for player 
        await this.levelService.createPlayerLevel(newPlayer.username);
        const savedPlayer = await this.playerRepository.save(newPlayer);
        // update the salted 
        playerSalt.salt += 1;
        await this.playerSaltedRepository.save(playerSalt);
        return {
            username: savedPlayer.username,
            smartAddress: savedPlayer.smartAccountAddress
        };
    }
    async getPlayer(username) {
        const player = await this.playerRepository.findOne({
            where: { username: username }
        });
        if (!player) {
            throw new Error(`could not locate player with the username ${username}`);
        }
        // get player token balance 
        const tokenContract = await this.permissionlessService.getContractInstance(process.env.TOKEN_CONTRACT, TokenAbi.abi);
        const playerTokenBalance = await tokenContract.read.balanceOf([player.smartAccountAddress]);
        const decimals = await tokenContract.read.decimals([]);
        return {
            username: player.username,
            tokenBalance: (0, viem_1.formatUnits)(playerTokenBalance, decimals),
            smartAccountAddress: player.smartAccountAddress,
        };
    }
}
exports.PlayerService = PlayerService;
