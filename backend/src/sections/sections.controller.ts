import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
    constructor(private readonly sectionService: SectionsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.SECTION, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Create a new section'})
    @ApiResponse({ status: 201, description: 'Section created successfully'})
    @ApiBearerAuth()
    create(@Body() createSectionDto: CreateSectionDto) {
        return this.sectionService.create(createSectionDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.SECTION, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all sections (tree structure)'})
    @ApiResponse({ status: 200, description: 'Return all sections as tree'})
    findAll() {
        return this.sectionService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.SECTION, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get section by ID' })
    @ApiResponse({ status: 200, description: 'Return section by ID' })
    findOne(@Param('id') id: string) {
        return this.sectionService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.SECTION, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update section'})
    @ApiResponse({ status: 200, description: 'Section update successfully'})
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
        return this.sectionService.update(id, updateSectionDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions({ model: ModelNameEnum.SECTION, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete section (soft delete)'})
    @ApiResponse({ status: 200, description: 'Section deleted successfully'})
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.sectionService.remove(id);
    }
}