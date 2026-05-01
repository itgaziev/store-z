import { Currencies } from "@/currencies/entities/currencies.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('pricecategories')
export class PriceCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column({ default : false })
    isPorchasePrice: boolean;

    @Column()
    name: string;

    @ManyToOne(() => Currencies, (currencies) => currencies.id)
    @JoinColumn({ name: 'currenciesId'})
    currencies: Currencies;

    @Column()
    currenciesId: string;
}