import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';

@ApiTags('Barcodes')
@Controller('barcodes')
export class BarcodesController {
    constructor(private readonly barcodesService: BarcodesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Add new barcode' })
    @ApiResponse({ status: 201, description: 'Barcode add successfully' })
    @ApiBearerAuth()
    create(@Body() createBarcodeDto: CreateBarcodeDto) {
        return this.barcodesService.create(createBarcodeDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all barcode current product' })
    @ApiResponse({ status: 200, description: 'Return all barcode current product' })
    findByProduct(@Query('productId') productId: string) {
        return this.barcodesService.findByProduct(productId);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all barcode current offer' })
    @ApiResponse({ status: 200, description: 'Return all barcode current offer' })
    findByOffer(@Query('offerId') offerId: string) {
        return this.barcodesService.findByOffer(offerId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get barcode by ID' })
    @ApiResponse({ status: 200, description: 'Return barcode by ID' })
    findOne(@Param('id') id: string) {
        return this.barcodesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update barcode' })
    @ApiResponse({ status: 200, description: 'Barcode updated successfully' })
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateBarcodeDto: UpdateBarcodeDto) {
        return this.barcodesService.update(id, updateBarcodeDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete barcode (soft delete)' })
    @ApiResponse({ status: 200, description: 'Barcode deleted successfully' })
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.barcodesService.remove(id);
    }
}
