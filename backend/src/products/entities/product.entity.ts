import { ProductImage } from "@/images/entities/product-image.entity";
import { Section } from "@/sections/entities/section.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: true})
    uuid: string;

    @Column()
    name: string;

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

    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
