import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column()
    username?: string;

    @Column({
        name: 'user_address',
        type: 'varchar',
        nullable: false
    })
    userAddress?: string;

    @Column({
        name: 'smart_account_address'
    })
    smartAccountAddress?: string;
}