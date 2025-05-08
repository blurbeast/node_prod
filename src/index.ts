
import express , { Express, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import 'dotenv';
import routes from './routes';
import { config } from 'dotenv';
config();
const app: Express = express();

app.use(express.json());


const defaultRouter = (req: Request, res: Response) => {
    res.send('loaded it on truck');
}


const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],
    migrations: ['src/migration/*.ts'],
    synchronize: true,
    // logging: true
});

app.get('/', defaultRouter);
app.use('/api', routes);

appDataSource.initialize().then(async() => {
    // await appDataSource.runMigrations();
    app.listen(2000, ()=> console.log("port at ::: 2000"));
}).catch((error) => console.error('error at ', error));