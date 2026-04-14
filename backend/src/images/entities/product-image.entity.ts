import { Product } from "@/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('images')
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ name: 'file_name'})
    fileName: string;

    @Column({ name: 'original_name'})
    originalName: string;

    @Column({ name: 'mime_type' })
    mimeType: string;

    @Column({ name: 'file_size' })
    fileSize: number;

    @Column({ name: 'is_main', default: false })
    isMain: boolean;

    @Column({ default: 0 })
    order: number;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
