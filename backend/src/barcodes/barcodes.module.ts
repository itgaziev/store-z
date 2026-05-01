import { Module } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';
import { BarcodesController } from './barcodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barcode } from './entities/barcode.entity';
import { Product } from '@/products/entities/product.entity';
import { Offer } from '@/offers/entities/offer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Barcode, Product, Offer]),
    ],
    controllers: [BarcodesController],
    providers: [BarcodesService],
})
export class BarcodesModule { }
