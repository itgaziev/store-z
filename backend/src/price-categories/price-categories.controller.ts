import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { PriceCategoriesService } from './price-categories.service';
import { CreatePriceCategoryDto } from './dto/create-price-category.dto';
import { UpdatePriceCategoryDto } from './dto/update-price-category.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags('PriceCategories')
@Controller('pricecategories')
export class PriceCategoriesController {
    constructor(private readonly priceCategoriesService: PriceCategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Add new currencies' })
    @ApiResponse({ status: 201, description: 'Price category add successfully' })
    @ApiBearerAuth()
    create(@Body() createPriceCategoryDto: CreatePriceCategoryDto) {
        return this.priceCategoriesService.create(createPriceCategoryDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all price category' })
    @ApiResponse({ status: 200, description: 'Return all price category' })
    findAll() {
        return this.priceCategoriesService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get price category by ID' })
    @ApiResponse({ status: 200, description: 'Return price category by ID' })
    findOne(@Param('id') id: string) {
        return this.priceCategoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update price category' })
    @ApiResponse({ status: 200, description: 'Price category updated successfully' })
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updatePriceCategoryDto: UpdatePriceCategoryDto) {
        return this.priceCategoriesService.update(id, updatePriceCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete price category (soft delete)' })
    @ApiResponse({ status: 200, description: 'Price category deleted successfully' })
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.priceCategoriesService.remove(id);
    }
}
