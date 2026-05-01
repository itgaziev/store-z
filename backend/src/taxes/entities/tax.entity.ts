import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tax {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 0 })
    percent: number;
}