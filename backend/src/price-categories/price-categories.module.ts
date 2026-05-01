import { Module } from '@nestjs/common';
import { PriceCategoriesService } from './price-categories.service';
import { PriceCategoriesController } from './price-categories.controller';

@Module({
  controllers: [PriceCategoriesController],
  providers: [PriceCategoriesService],
})
export class PriceCategoriesModule {}
