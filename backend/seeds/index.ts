import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import runSeed from './seed';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        await runSeed(dataSource);
        console.log('🎉 All seeds applied successfully!');
    } catch (error) {
        console.error('❌ Error running seeds:', error);
        process.exit(1);
    } finally {
        await app.close();
    }
}

bootstrap();