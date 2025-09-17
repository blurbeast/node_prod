"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const routes_js_1 = require("./routes.js");
const dotenv_1 = require("dotenv");
const player_entity_js_1 = require("./player/entities/player.entity.js");
const salted_entity_js_1 = require("./player/entities/salted.entity.js");
const level_entity_js_1 = require("./level/entity/level.entity.js");
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
    entities: [player_entity_js_1.Player, salted_entity_js_1.PlayerSalt, level_entity_js_1.Level],
    migrations: ['dist/migration/*.js'],
    synchronize: false,
    // logging: true
});
exports.appDataSource.initialize().then(async () => {
    console.log('port is :::', APP_PORT);
    await exports.appDataSource.runMigrations();
    const appRounter = new routes_js_1.AppRouter();
    app.get('/', defaultRouter);
    app.use('/api', appRounter.getRouter());
    app.listen(APP_PORT, () => console.log(`port at ::: ${APP_PORT}`));
}).catch((error) => console.error('error at ', error));
