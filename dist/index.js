"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const routes_1 = require("./routes");
const dotenv_1 = require("dotenv");
const player_entity_1 = require("./player/entities/player.entity");
const salted_entity_1 = require("./player/entities/salted.entity");
const level_entity_1 = require("./level/entity/level.entity");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const defaultRouter = (req, res) => {
    res.send('loaded it on truck');
};
const APP_PORT = parseInt(process.env.APP_PORT || '', 10) || 3000;
exports.appDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [player_entity_1.Player, salted_entity_1.PlayerSalt, level_entity_1.Level],
    migrations: ['src/migration/*.ts'],
    synchronize: false,
    // logging: true
});
exports.appDataSource.initialize().then(async () => {
    console.log('port is :::', APP_PORT);
    await exports.appDataSource.runMigrations();
    const appRounter = new routes_1.AppRouter();
    app.get('/', defaultRouter);
    app.use('/api', appRounter.getRouter());
    app.listen(APP_PORT, () => console.log(`port at ::: ${APP_PORT}`));
}).catch((error) => console.error('error at ', error));
