import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiBearerAuth()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
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
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Return product by ID'})
    findOne(@Param('id') id: number) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully'})
    @ApiBearerAuth()
    update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Delete product (soft delete)'})
    @ApiResponse({ status: 200, description: 'Product deleted successfully'})
    remove(@Param('id') id: number) {
        return this.productsService.remove(id);
    }
}
