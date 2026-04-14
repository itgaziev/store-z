import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/products/entities/product.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ProductImage } from './entities/product-image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductImage, Product]),
        ServeStaticModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => [{
                rootPath: join(__dirname, '..', '..', configService.get<string>('UPLOAD_PATH') || 'uploads'),
                serveRoot: '/uploads',
            }],
            inject: [ConfigService],
        }),
    ],
    controllers: [ImagesController],
    providers: [ImagesService],
    exports: [ImagesService]
})
export class ImagesModule { }
