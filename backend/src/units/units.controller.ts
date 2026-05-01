import { UnitsService } from './units.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('units')
export class UnitsController {
    constructor(private readonly unitsService: UnitsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Add new currencies' })
    @ApiResponse({ status: 201, description: 'Currencies add successfully' })
    @ApiBearerAuth()
    create(@Body() createUnitDto: CreateUnitDto) {
        return this.unitsService.create(createUnitDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all currencies current product' })
    @ApiResponse({ status: 200, description: 'Return all currencies' })
    findAll() {
        return this.unitsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get currencies by ID' })
    @ApiResponse({ status: 200, description: 'Return currencies by ID' })
    findOne(@Param('id') id: string) {
        return this.unitsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update currencies' })
    @ApiResponse({ status: 200, description: 'Currencies updated successfully' })
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
        return this.unitsService.update(id, updateUnitDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete currencies (soft delete)' })
    @ApiResponse({ status: 200, description: 'Currencies deleted successfully' })
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.unitsService.remove(id);
    }
}
