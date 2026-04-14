import { Product } from "@/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

@Entity('sections')
@Tree('closure-table')
export class Section {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: true })
    uuid: string;
    
    @Column({ nullable: true })
    code: string;
    
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @TreeParent()
    parent: Section;

    @TreeChildren()
    children: Section[];

    @OneToMany(() => Product, (product) => product.section)
    products: Product[];

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
}