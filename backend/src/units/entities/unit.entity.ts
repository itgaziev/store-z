import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('units')
export class Unit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column()
    fullName: string;
}