import { Barcode } from "@/barcodes/entities/barcode.entity";
import { Product } from "@/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('units')
export class Unit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    fullName: string;

    @OneToMany(() => Product, (product) => product.unit)
    products: Product[];

    @OneToMany(() => Barcode, (barcode) => barcode.unit)
    barcodes: Barcode[];
    
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
}