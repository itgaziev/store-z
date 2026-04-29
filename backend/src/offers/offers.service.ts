import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Equal, Repository } from 'typeorm';
import { Product } from '@/products/entities/product.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private offersRepository: Repository<Offer>,
        @InjectRepository(Product)
        private productRepository: Repository<Offer>
    ) { }

    async create(createOfferDto: CreateOfferDto): Promise<Offer> {
        const existingOffer = await this.offersRepository.findOne({
            where: { name: createOfferDto.name, parent: Equal(createOfferDto.parentId) },
            withDeleted: true
        });

        if (existingOffer) throw new ConflictException('Offers with this name already exists');

        const product = await this.productRepository.findOne({
            where: { id: createOfferDto.parentId },
            withDeleted: true
        });

        if (!product) throw new NotFoundException('Product not found');
        
        const offer = this.offersRepository.create({
            ...createOfferDto,
            parent: product
        });

        
        return this.offersRepository.save(offer);
    }

    async findAll(parentId: string): Promise<{ data: Offer[] }> {
        const offers = await this.offersRepository.find({
            where: {
                parent: { id: parentId } // Указываем ID связанной сущности
            },
            // Если нужно вернуть данные о самом продукте вместе с оффером:
            // relations: ['parent'] 
        });

        return { data: offers };
    }

    async findOne(id: string): Promise<Offer> {
        const offer = await this.offersRepository.findOne({
            where: { id },
            relations: ['parent'],
            withDeleted: true,
        });

        if (!offer) throw new NotFoundException('Offer not found');

        return offer;
    }

    async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        const offer = await this.findOne(id);

        if (updateOfferDto.name && updateOfferDto.name !== offer.name) {
            const existingOffer = await this.offersRepository.findOne({
                where: { name: updateOfferDto.name, parent: offer.parent },
                withDeleted: true
            });

            if (existingOffer && existingOffer.id !== id) {
                throw new ConflictException('Offer with this name already exists');
            }
        }

        Object.assign(offer, updateOfferDto);
        return this.offersRepository.save(offer);
    }

    async remove(id: string): Promise<void> {
        await this.offersRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.offersRepository.restore(id);
    }
}
