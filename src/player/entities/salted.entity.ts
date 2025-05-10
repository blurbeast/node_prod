import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('players_salt')
export class PlayerSalt {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({
        name: 'salt',
        type: 'int'
    })
    salt!: number;
}