import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';

@ApiTags('Images')
@Controller('images')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) { }

    @Post('upload')
    @Permissions({ model: ModelNameEnum.IMAGE, access: AccessEnum.WRITE })
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
    @Permissions({ model: ModelNameEnum.IMAGE, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Set image as main' })
    @ApiResponse({ status: 200, description: 'Image set as main'})
    setAsMain(@Param('id') id: string) {
        return this.imagesService.setAsMain(id);
    }

    @Delete(':id')
    @Permissions({ model: ModelNameEnum.IMAGE, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete image'})
    @ApiResponse({ status: 200, description: 'Image deleted successfully'})
    remove(@Param('id') id: string) {
        return this.imagesService.remove(id)
    }
}