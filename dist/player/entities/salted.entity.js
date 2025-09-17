"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSalt = void 0;
const typeorm_1 = require("typeorm");
let PlayerSalt = class PlayerSalt {
    id;
    salt;
};
exports.PlayerSalt = PlayerSalt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], PlayerSalt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'salt',
        type: 'int'
    }),
    __metadata("design:type", Number)
], PlayerSalt.prototype, "salt", void 0);
exports.PlayerSalt = PlayerSalt = __decorate([
    (0, typeorm_1.Entity)('players_salt')
], PlayerSalt);
