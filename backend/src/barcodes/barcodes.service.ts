import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barcode } from './entities/barcode.entity';
import { Repository } from 'typeorm';
import { Product } from '@/products/entities/product.entity';
import { Offer } from '@/offers/entities/offer.entity';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';

@Injectable()
export class BarcodesService {
    constructor(
        @InjectRepository(Barcode)
        private barcodeRepository: Repository<Barcode>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>
    ) { }

    async create(createBarcodeDto: CreateBarcodeDto): Promise<Barcode> {
        const existingBarcode = await this.barcodeRepository.findOne({
            where: { barcode: createBarcodeDto.barcode },
            withDeleted: true
        });

        if (existingBarcode) throw new ConflictException('Barcode with this code already exists');

        const product = await this.productRepository.findOne({
            where: { id: createBarcodeDto.productId },
            withDeleted: true
        });

        if (!product) throw new NotFoundException('Product not found');

        if (createBarcodeDto.offerId) {
            const offer = await this.offerRepository.findOne({
                where: { id: createBarcodeDto.offerId },
                withDeleted: true
            });

            if (!offer) throw new NotFoundException('Offer not found');

            const barcode = this.barcodeRepository.create({
                ...createBarcodeDto,
                product: product,
                offer: offer
            });

            return this.barcodeRepository.save(barcode);
        }

        const barcode = this.barcodeRepository.create({
            ...createBarcodeDto,
            product: product,
        });

        return this.barcodeRepository.save(barcode);
    }

    async findByProduct(productId: string): Promise<Barcode[]> {        
        return this.barcodeRepository.find({
            where: { productId : productId }
        });
    }

    async findByOffer(offerId: string): Promise<Barcode[]> {
        return this.barcodeRepository.find({
            where: { offerId: offerId }
        });
    }

    async findOne(id: string): Promise<Barcode> {
        const barcode = await this.barcodeRepository.findOne({
            where: { id },
            withDeleted: true
        });

        if (!barcode) throw new NotFoundException('Barcode not found');

        return barcode;
    }

    async update(id: string, updateBarcodeDto: UpdateBarcodeDto): Promise<Barcode> {
        const barcode = await this.findOne(id);

        if (updateBarcodeDto.barcode && updateBarcodeDto.barcode !== barcode.barcode) {
            const existingBarcode = await this.barcodeRepository.findOne({
                where: { barcode: updateBarcodeDto.barcode },
                withDeleted: true
            });

            if (existingBarcode && existingBarcode.id !== id) {
                throw new ConflictException('Barcode with this name already exists');
            }
        }

        Object.assign(barcode, updateBarcodeDto);
        return this.barcodeRepository.save(barcode);
    }

    async remove(id: string): Promise<void> {
        await this.barcodeRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.barcodeRepository.restore(id);
    }
}
