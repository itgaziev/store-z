import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@ApiTags('Offers')
@Controller('offers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Add new offer' })
    @ApiResponse({ status: 201, description: 'Offer add successfully' })
    @ApiBearerAuth()
    create(@Body() createOfferDto: CreateOfferDto) {
        return this.offersService.create(createOfferDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all offer current product' })
    @ApiResponse({ status: 200, description: 'Return all offer current product' })
    findAll(@Query('parentId') parentId: string) {
        return this.offersService.findAll(parentId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get offer by ID' })
    @ApiResponse({ status: 200, description: 'Return offer by ID' })
    findOne(@Param('id') id: string) {
        return this.offersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update offer' })
    @ApiResponse({ status: 200, description: 'Offer updated successfully' })
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
        return this.offersService.update(id, updateOfferDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.OFFER, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete offer (soft delete)' })
    @ApiResponse({ status: 200, description: 'Offer deleted successfully' })
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.offersService.remove(id);
    }
}
