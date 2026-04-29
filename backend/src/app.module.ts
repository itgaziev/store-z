import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { SectionsModule } from './sections/sections.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ImagesModule } from './images/images.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { OffersModule } from './offers/offers.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            useFactory: databaseConfig
        }),
        AuthModule,
        UsersModule,
        SectionsModule,
        ProductsModule,
        WarehousesModule,
        ImagesModule,
        OffersModule,
        CurrenciesModule
    ],
})
export class AppModule { }
