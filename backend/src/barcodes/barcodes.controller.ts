import { Controller } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';

@Controller('barcodes')
export class BarcodesController {
  constructor(private readonly barcodesService: BarcodesService) {}
}
