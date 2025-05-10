
import express , { Express, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import 'dotenv';
import { AppRouter } from './routes';
import { config } from 'dotenv';
import { Player } from './player/entities/player.entity';
import { PlayerSalt } from './player/entities/salted.entity';
import { Level } from './level/entity/level.entity';
config();
const app: Express = express();

app.use(express.json());


const defaultRouter = (req: Request, res: Response) => {
    res.send('loaded it on truck');
}

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Player, PlayerSalt, Level],
    migrations: ['src/migration/*.ts'],
    synchronize: false,
    // logging: true
});


appDataSource.initialize().then(async() => {
    await appDataSource.runMigrations();
    const appRounter = new AppRouter();
    app.get('/', defaultRouter);
    app.use('/api', appRounter.getRouter());
    app.listen(2000, ()=> console.log("port at ::: 2000"));
}).catch((error) => console.error('error at ', error));