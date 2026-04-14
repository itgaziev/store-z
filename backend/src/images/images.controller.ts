import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';

@ApiTags('Images')
@Controller('images')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) { }

    @Post('upload')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Upload product image' })
    @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                productId: { type: 'string', format: 'uuid' },
                isMain: { type: 'boolean', default: false },
                order: { type: 'number', default: 0}
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
        @UploadedFile() file: any,
        @Body() uploadImageDto: UploadImageDto,
    ) {
        return this.imagesService.uploadImage(file, uploadImageDto);
    }

    @Patch(':id/main')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Set image as main' })
    @ApiResponse({ status: 200, description: 'Image set as main'})
    setAsMain(@Param('id') id: string) {
        return this.imagesService.setAsMain(id);
    }

    @Delete(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Delete image'})
    @ApiResponse({ status: 200, description: 'Image deleted successfully'})
    remove(@Param('id') id: string) {
        return this.imagesService.remove(id)
    }
}
