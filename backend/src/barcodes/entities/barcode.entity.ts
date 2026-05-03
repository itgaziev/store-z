import { Offer } from "@/offers/entities/offer.entity";
import { Product } from "@/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BarcodeTypeEnum } from "../../common/enums/barcodes.enum";
import { Unit } from "@/units/entities/unit.entity";

@Entity('barcodes')
export class Barcode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    barcode: string;

    @Column({
        type: 'enum',
        enum: BarcodeTypeEnum,
        default: BarcodeTypeEnum.EAN13
    })
    type: BarcodeTypeEnum;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Product, (product) => product.barcodes, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    @ManyToOne(() => Offer, (offer) => offer.barcodes, { nullable: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'offerId' })
    offer: Offer;

    @Column({ nullable: true })
    offerId: string;

    @ManyToOne(() => Unit, (unit) => unit.code)
    @JoinColumn({ name: 'unit_id'})
    unit: Unit;

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


    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;    
}
