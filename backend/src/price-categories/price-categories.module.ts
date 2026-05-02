import { Module } from '@nestjs/common';
import { PriceCategoriesService } from './price-categories.service';
import { PriceCategoriesController } from './price-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceCategory } from './entities/price-category.entity';
import { Currencies } from '@/currencies/entities/currencies.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PriceCategory, Currencies])],
    controllers: [PriceCategoriesController],
    providers: [PriceCategoriesService],
})
export class PriceCategoriesModule { }
