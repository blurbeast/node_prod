import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('players')
export class Player {
    @PrimaryGeneratedColumn('increment')
    id!: number;
    @Column()
    username!: string;
    @Column({
        name: 'smart_account_address',
        type: 'varchar',
        nullable: false,
        unique: true,
    })
    smartAccountAddress!: string;
    @Column({
        name: 'player_salt',
        type: 'int',
        nullable: false,
        unique: true
    })
    playerSalt!: number; 
}