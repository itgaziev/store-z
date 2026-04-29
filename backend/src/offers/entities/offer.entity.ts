import { Barcode } from "@/barcodes/entities/barcode.entity";
import { Product } from "@/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('offers')
export class Offer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'bigint', unique: true, default: () => "nextval('offer_number_seq')" })
    number: number;

    @Column()
    xmlCode: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Product
    
    @OneToMany(() => Barcode, (barcode) => barcode.offer, { cascade: true })
    barcodes: Barcode[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}