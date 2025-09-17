import "reflect-metadata";
import express , { Express, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { AppRouter } from './routes.js';
import { config } from 'dotenv';
import { Player } from './player/entities/player.entity.js';
import { PlayerSalt } from './player/entities/salted.entity.js';
import { Level } from './level/entity/level.entity.js';
config();
const app: Express = express();

app.use(express.json());

const defaultRouter = (req: Request, res: Response) => {
    res.send('loaded it on truck');
}

const APP_PORT = parseInt(process.env.APP_PORT || '', 10) || 3000;

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Player, PlayerSalt, Level],
    migrations: ['src/migration/*.js'],
    synchronize: false,
    // logging: true
});


appDataSource.initialize().then(async() => {
    console.log('port is :::', APP_PORT);
    await appDataSource.runMigrations();
    const appRounter = new AppRouter();
    app.get('/', defaultRouter);
    app.use('/api', appRounter.getRouter());
    app.listen(APP_PORT, ()=> console.log(`port at ::: ${APP_PORT}`));
}).catch((error) => console.error('error at ', error));