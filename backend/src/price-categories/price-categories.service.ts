import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceCategory } from './entities/price-category.entity';
import { Repository } from 'typeorm';
import { Currencies } from '@/currencies/entities/currencies.entity';
import { CreatePriceCategoryDto } from './dto/create-price-category.dto';
import { UpdatePriceCategoryDto } from './dto/update-price-category.dto';

@Injectable()
export class PriceCategoriesService {
    constructor(
        @InjectRepository(PriceCategory)
        private priceCategoryRepository: Repository<PriceCategory>,

        @InjectRepository(Currencies)
        private currenciesRepository: Repository<Currencies>
    ) {}

    async create(createPriceCategoryDto: CreatePriceCategoryDto): Promise<PriceCategory> {
        const existingPriceCategory = await this.priceCategoryRepository.findOne({
            where: { code: createPriceCategoryDto.code },
            withDeleted: true
        });

        if (existingPriceCategory) throw new ConflictException('Price category with this code already exists');

        const currencies = await this.currenciesRepository.findOne({
            where: { id: createPriceCategoryDto.currenciesId },
            withDeleted: true
        });

        if (!currencies) throw new NotFoundException('Currencies not found');

        const priceCategory = this.priceCategoryRepository.create(createPriceCategoryDto);

        return this.priceCategoryRepository.save(priceCategory);
    }

    async findAll(): Promise<PriceCategory[]> {
        return this.priceCategoryRepository.find();
    }

    async findOne(id: string): Promise<PriceCategory> {
        const priceCategory = await this.priceCategoryRepository.findOne({
            where: { id },
            withDeleted: true
        });

        if (!priceCategory) throw new NotFoundException("Price category not found");

        return priceCategory;
    }

    async update(id: string, updatePriceCategoryDto: UpdatePriceCategoryDto): Promise<PriceCategory> {
        const priceCategory = await this.findOne(id);

        if (updatePriceCategoryDto.code && updatePriceCategoryDto.code !== priceCategory.code) {
            const existingPriceCategory = await this.priceCategoryRepository.findOne({
                where: { code: updatePriceCategoryDto.code },
                withDeleted: true
            });

            if (existingPriceCategory && existingPriceCategory.id !== id) {
                throw new ConflictException('Price Category code already exists');
            }
        }

        Object.assign(priceCategory, updatePriceCategoryDto);
        return this.priceCategoryRepository.save(priceCategory);
    }

    async remove(id: string): Promise<void> {
        await this.priceCategoryRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.priceCategoryRepository.restore(id);
    }
}
