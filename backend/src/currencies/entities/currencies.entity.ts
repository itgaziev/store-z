import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('currencies')
export class Currencies {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    fullName: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 3,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        },
        default: 1.000
    })
    rate: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;    
}