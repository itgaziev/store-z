import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';

@ApiTags('Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) {}

    @Post()
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Create a new warehouse' })
    @ApiResponse({ status: 201, description: 'Warehouse created succesfully' })
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehousesService.create(createWarehouseDto);
    }

    @Get()
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all warehouses'})
    @ApiResponse({ status: 200, description: 'Return all warehouses'})
    findAll(@Query() paginationDto: PaginationDto) {
        return this.warehousesService.findAll(paginationDto);
    }

    @Get(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get warehouses by ID'})
    @ApiResponse({ status: 200, description: 'Return warehouses by ID'})
    findOne(@Param('id') id: string) {
        return this.warehousesService.findOne(id);
    }    

    @Patch(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update warehouse'})
    @ApiResponse({ status: 200, description: 'Warehouse updated successfully'})
    update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
        return this.warehousesService.update(id, updateWarehouseDto);
    }

    @Delete(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete warehouse (soft delete)'})
    @ApiResponse({ status: 200, description: 'Warehouse deleted successfully'})
    remove(@Param('id') id: string) {
        return this.warehousesService.remove(id);
    }
}