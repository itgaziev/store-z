import { PriceCategory } from "@/price-categories/entities/price-category.entity";
import { Transform } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('currencies')
export class Currencies {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column({ default : false })
    isBase: boolean;

    @Column()
    fullName: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 3,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value).toFixed(3)
        },
        default: 1.000
    })
    @Transform(({ value }) => parseFloat(value).toFixed(3), { toPlainOnly: true })
    rate: number;

    @OneToMany(() => PriceCategory, (priceCategory) => priceCategory.currencies)
    priceCategories: PriceCategory[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;    
}