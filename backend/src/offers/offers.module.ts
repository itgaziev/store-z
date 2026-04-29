import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/products/entities/product.entity';
import { Offer } from './entities/offer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Offer, Product]),
    ],
    controllers: [OffersController],
    providers: [OffersService],
})
export class OffersModule { }
