import { Module } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';
import { BarcodesController } from './barcodes.controller';

@Module({
  controllers: [BarcodesController],
  providers: [BarcodesService],
})
export class BarcodesModule {}
