import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({ unique: true})
    code: string;

    @Column({ nullable: true})
    address: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
}