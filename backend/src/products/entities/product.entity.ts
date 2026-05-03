import { Barcode } from "@/barcodes/entities/barcode.entity";
import { ProductImage } from "@/images/entities/product-image.entity";
import { Offer } from "@/offers/entities/offer.entity";
import { Section } from "@/sections/entities/section.entity";
import { Unit } from "@/units/entities/unit.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bigint', unique: true, default: () => "nextval('product_number_seq')" })
    number: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ type: 'text', nullable: true})
    description: string;

    @Column({ nullable: true })
    sku: string;

    @Column({ nullable: true })
    xmlCode: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Section, (section) => section.products)
    @JoinColumn({ name: 'section_id' })
    section: Section; 

    @OneToMany(() => Offer, (offer) => offer.parent, { cascade: true })
    offers: Offer[];

    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];

    @OneToMany(() => Barcode, (barcode) => barcode.product, { cascade: true })
    barcodes: Barcode[];

    @ManyToOne(() => Unit, (unit) => unit.products)
    @JoinColumn({ name: 'unit_id'})
    unit: Unit;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
