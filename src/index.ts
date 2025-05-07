

import express , { Express, Request, Response } from 'express';

const app: Express = express();

app.use(express.json());


const defaultRouter = (req: Request, res: Response) => {
    res.send('loaded it on truck');
}

app.get('/', defaultRouter);

app.listen(2000, ()=> console.log("port at ::: 2000"));