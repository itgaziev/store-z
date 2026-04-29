import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiBearerAuth()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Return all products' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sectionId', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    findAll(@Query() paginationDto: PaginationDto, @Query('sectionId') sectionId?: string, @Query('search') search?: string) {
        return this.productsService.findAll(paginationDto, sectionId, search);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Return product by ID'})
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully'})
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.PRODUCT, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete product (soft delete)'})
    @ApiResponse({ status: 200, description: 'Product deleted successfully'})
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}