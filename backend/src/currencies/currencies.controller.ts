import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';
import { CreateCurrenciesDto } from './dto/create-currencies.dto';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Add new currencies' })
    @ApiResponse({ status: 201, description: 'Currencies add successfully' })
    @ApiBearerAuth()
    create(@Body() createCurrenciesDto: CreateCurrenciesDto) {
        return this.currenciesService.create(createCurrenciesDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all currencies current product' })
    @ApiResponse({ status: 200, description: 'Return all currencies' })
    findAll() {
        return this.currenciesService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get currencies by ID' })
    @ApiResponse({ status: 200, description: 'Return currencies by ID' })
    findOne(@Param('id') id: string) {
        return this.currenciesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update currencies' })
    @ApiResponse({ status: 200, description: 'Currencies updated successfully' })
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateCurrenciesDto: UpdateCurrenciesDto) {
        return this.currenciesService.update(id, updateCurrenciesDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.CURRENCIES, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete currencies (soft delete)' })
    @ApiResponse({ status: 200, description: 'Currencies deleted successfully' })
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.currenciesService.remove(id);
    }
}
