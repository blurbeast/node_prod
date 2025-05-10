import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Level {
    @PrimaryGeneratedColumn('increment')
    id!: number;   
    @Column({
        name: 'player_user_name',
        type: 'varchar',
        nullable: false,
        unique: true,
      })
    playerUsername!: string;
    @Column({ name: 'player_score', type: 'int', default: 0 })
    @Index()
    playerScore!: number;
}