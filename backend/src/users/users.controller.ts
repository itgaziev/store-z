import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ModelNameEnum } from '@/common/enums/model-name.enum';
import { AccessEnum } from '@/common/enums/access.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users' })
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('sortBy') sortBy: string = 'createdAt', @Query('order') order: 'ASC' | 'DESC' = 'DESC', @Query('searchTerm') searchTerm: string = '') {
        return this.usersService.findAll(+page, +limit, sortBy, order, searchTerm);
    }

    @Get('roles')
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'Return all roles' })
    getRoles(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('sortBy') sortBy: string = 'createdAt', @Query('order') order: 'ASC' | 'DESC' = 'DESC', @Query('searchTerm') searchTerm: string = '') {
        return this.usersService.getRoles(+page, +limit, sortBy, order, searchTerm);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({ status: 200, description: 'Return current user' })
    findCurrentUser(@CurrentUser() user: any) {
        return this.usersService.findOne(user.sub);
    }

    @Get(':id')
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.READ })
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Return user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.WRITE })
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Permissions({ model: ModelNameEnum.USER, access: AccessEnum.DELETE })
    @ApiOperation({ summary: 'Delete user (soft delete)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}