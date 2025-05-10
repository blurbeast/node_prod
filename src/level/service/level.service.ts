import { DataSource, Repository } from "typeorm";
import { Level } from "../entity/level.entity";

export class LevelService {
    private readonly levelRepository: Repository<Level>

    constructor(appDataSource: DataSource) {
        this.levelRepository = appDataSource.getRepository(Level);
    }

    async createPlayerLevel(playerUsername: string) {
        // get the level out 
        const playerLevel = await this.levelRepository.findOne({
            where: { playerUsername: playerUsername.toLowerCase() }
        });

        if (playerLevel) {
            throw new Error(`a player with the specified username already exist`);
        } 

        const newPlayerLevel = new Level();
        newPlayerLevel.playerUsername = playerUsername.toLowerCase();

        await this.levelRepository.save(newPlayerLevel);
    }

    async addPlayerScore(username: string, score: number) {
        // get the player level
        const playerLevel = await this.levelRepository.findOne({
            where: { playerUsername: username }
        });

        if(!playerLevel) {
            throw new Error(`could not locate player level with the specified username ? ${username}`)
        }

        playerLevel.playerScore += score;

        // save or update the player level 
        await this.levelRepository.save(playerLevel);
    }

    async getPlayerLevelScore(username: string) {
        // get the player level
        const playerLevel = await this.levelRepository.findOne({
            where: { playerUsername: username }
        });

        if(!playerLevel) {
            throw new Error(`could not locate player level with the specified username ? ${username}`)
        }

        return {
            username: playerLevel.playerUsername,
            playerScore: playerLevel.playerScore
        }
    }
    
    async getTopNPlayerLevel(limit: number) {
        const results = await this.returnLevelsQuery()
        .orderBy('`level`.`player_score`', 'DESC')
        .limit(limit)
        .getRawMany();

        // to be changed later 
        return results;
     }

     async getPlayersLevelsPagination(limit: number, offset: number) {
        const results = await this.returnLevelsQuery()
          .orderBy('`level`.`player_score`', 'DESC')
          .limit(limit)
          .offset(offset)
          .getRawMany();

          // to be changed later 
          return results;
      }

    private returnLevelsQuery() {
        return this.levelRepository
          .createQueryBuilder('level')
          .select([
            '`level`.`player_user_name` AS `playerUsername`',
            '`level`.`player_score` AS `playerScore`',
            'DENSE_RANK() OVER (ORDER BY `level`.`player_score` DESC) AS `rank`',
          ]);
      }
}