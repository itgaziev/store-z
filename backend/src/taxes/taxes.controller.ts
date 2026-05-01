import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-taxes.dto';
import { UpdateTaxDto } from './dto/update-taxes.dto';

@Controller('taxes')
export class TaxesController {
    constructor(private readonly taxesService: TaxesService) { }

    @Post()
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Create a new tax' })
    @ApiResponse({ status: 201, description: 'Tax created succesfully' })
    create(@Body() createTaxDto: CreateTaxDto) {
        return this.taxesService.create(createTaxDto);
    }

    @Get()
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all taxes' })
    @ApiResponse({ status: 200, description: 'Return all taxes' })
    findAll() {
        return this.taxesService.findAll();
    }

    @Get(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get tax by ID' })
    @ApiResponse({ status: 200, description: 'Return tax by ID' })
    findOne(@Param('id') id: string) {
        return this.taxesService.findOne(id);
    }

    @Patch(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update Tax' })
    @ApiResponse({ status: 200, description: 'Tax updated successfully' })
    update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
        return this.taxesService.update(id, updateTaxDto);
    }

    @Delete(':id')
    @Permissions({ model: ModelNameEnum.WAREHOUSE, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete tax (soft delete)' })
    @ApiResponse({ status: 200, description: 'Tax deleted successfully' })
    remove(@Param('id') id: string) {
        return this.taxesService.remove(id);
    }
}
