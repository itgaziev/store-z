import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('Sections')
@Controller('sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SectionsController {
    constructor(private readonly sectionService: SectionsService) {}

    @Post()
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Create a new section'})
    @ApiResponse({ status: 201, description: 'Section created successfully'})
    create(@Body() createSectionDto: CreateSectionDto) {
        return this.sectionService.create(createSectionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sections (tree structure)'})
    @ApiResponse({ status: 200, description: 'Return all sections as tree'})
    findAll() {
        return this.sectionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get section by ID' })
    @ApiResponse({ status: 200, description: 'Return section by ID' })
    findOne(@Param('id') id: number) {
        return this.sectionService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Update section'})
    @ApiResponse({ status: 200, description: 'Section update successfully'})
    update(@Param('id') id: number, @Body() updateSectionDto: UpdateSectionDto) {
        return this.sectionService.update(id, updateSectionDto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Delete section (soft delete)'})
    @ApiResponse({ status: 200, description: 'Section deleted successfully'})
    remove(@Param('id') id: number) {
        return this.sectionService.remove(id);
    }
}
