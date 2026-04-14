import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Product } from '@/products/entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { UploadImageDto } from './dto/upload-image.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';


@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ProductImage)
        private imagesRepository: Repository<ProductImage>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private configService: ConfigService,
    ){}

    async uploadImage(file: any, uploadImageDto: UploadImageDto): Promise<ProductImage> {
        const product = await this.productsRepository.findOne({
            where: { id: uploadImageDto.productId },
            withDeleted: true,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Only JPG, PNG and WebP formats are allowed');
        }

        const maxFileSize = parseInt(this.configService.get<string>('MAX_FILE_SIZE') || '10485760');
        if (file.size > maxFileSize) {
            throw new BadRequestException(`File size must be less than ${maxFileSize / 1024 / 1024}MB`);
        }

        if (uploadImageDto.isMain) {
            await this.imagesRepository.update(
                { product: { id: uploadImageDto.productId }},
                { isMain: false }
            );
        }

        const uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
        const relativePath = `${uploadPath}/${file.filename}`;

        const image = this.imagesRepository.create({
            url: relativePath,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            isMain: uploadImageDto.isMain || false,
            order: uploadImageDto.order || 0,
            product
        })

        return this.imagesRepository.save(image);
    }

    async setAsMain(id: string): Promise<ProductImage> {
        const image = await this.imagesRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!image) {
            throw new NotFoundException('Image not found');
        }

        await this.imagesRepository.update(
            { product: { id: image.product.id }},
            { isMain: false },
        );

        image.isMain = true;
        return this.imagesRepository.save(image);
    }

    async remove(id: string): Promise<void> {
        const image = await this.imagesRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!image) {
            throw new NotFoundException('Image not found');
        }

        const uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
        const filePath = join(process.cwd(), uploadPath, image.fileName);

        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }

        await this.imagesRepository.delete(id);
    }
}
