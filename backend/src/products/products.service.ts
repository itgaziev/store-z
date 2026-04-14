import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Section } from '@/sections/entities/section.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Section)
        private sectionRepository: Repository<Section>,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const existingProduct = await this.productsRepository.findOne({
            where: { sku: createProductDto.sku },
            withDeleted: true,
        });

        if (existingProduct) {
            throw new ConflictException('Product with this SKU already exists');
        }

        const section = await this.sectionRepository.findOne({
            where: { id: createProductDto.sectionId },
            withDeleted: true,
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        const product = this.productsRepository.create({
            ...createProductDto,
            section,
        });

        return this.productsRepository.save(product);
    }

    async findAll(paginationDto: PaginationDto, sectionId?: string, search?: string) 
    : Promise<{ data: Product[]; total: number; page: number; limit: number}> {
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.section', 'section')
            // .leftJoinAndSelect('product.images', 'images')
            .where('product.deletedAt IS NULL');

        if (sectionId) {
            queryBuilder.andWhere('product.sectionId = :sectionId', { sectionId });
        }

        if (search) {
            queryBuilder.andWhere(
                '(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search)',
                { search: `%${search}%`}
            );
        }

        const skip = (paginationDto.page! - 1) * paginationDto.limit!;

        const [data, total] = await queryBuilder
            .skip(skip)
            .take(paginationDto.limit!)
            .getManyAndCount();

        return { data, total, page: paginationDto.page!, limit: paginationDto.limit! };
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['section'],
            withDeleted: true,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.productsRepository.findOne({
                where: { sku: updateProductDto.sku },
                withDeleted: true,
            });

            if (existingProduct && existingProduct.id !== id) {
                throw new ConflictException('Product with this sku already exists');
            }

            if (existingProduct && existingProduct.id !== id) {
                throw new ConflictException('Product with this SKU already exists');
            }
        }

        if (updateProductDto.sectionId) {
            const section = await this.sectionRepository.findOne({
                where: { id: updateProductDto.sectionId },
                withDeleted: true,
            });

            if (!section) {
                throw new NotFoundException('Section not found');
            }

            product.section = section;
            delete updateProductDto.sectionId;
        }

        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        await this.productsRepository.softDelete(id);
    }

    async restore(id: number): Promise<void> {
        await this.productsRepository.restore(id);
    }
}
