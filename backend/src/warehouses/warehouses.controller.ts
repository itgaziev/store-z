import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@ApiTags('Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) {}

    @Post()
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Create a new warehouse' })
    @ApiResponse({ status: 201, description: 'Warehouse created succesfully' })
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehousesService.create(createWarehouseDto);
    }

    @Get()
    @Roles('ADMIN', 'MANAGER', 'USER')
    @ApiOperation({ summary: 'Get all warehouses'})
    @ApiResponse({ status: 200, description: 'Return all warehouses'})
    findAll(@Query() paginationDto: PaginationDto) {
        return this.warehousesService.findAll(paginationDto);
    }

    @Get(':id')
    @Roles('ADMIN', 'MANAGER', 'USER')
    @ApiOperation({ summary: 'Get warehouses by ID'})
    @ApiResponse({ status: 200, description: 'Return warehouses by ID'})
    findOne(@Param('id') id: number) {
        return this.warehousesService.findOne(id);
    }    

    @Patch(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Update warehouse'})
    @ApiResponse({ status: 200, description: 'Warehouse updated successfully'})
    update(@Param('id') id: number, @Body() updateWarehouseDto: UpdateWarehouseDto) {
        return this.warehousesService.update(id, updateWarehouseDto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Delete warehouse (soft delete)'})
    @ApiResponse({ status: 200, description: 'Warehouse deleted successfully'})
    remove(@Param('id') id: number) {
        return this.warehousesService.remove(id);
    }
}
