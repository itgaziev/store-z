import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Create a new user'})
    @ApiResponse({ status: 201, description: 'User created successfully'})
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Get all users'})
    @ApiResponse({ status: 200, description: 'Return all users'})
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.usersService.findAll(+page, +limit);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user'})
    @ApiResponse({ status: 200, description: 'Return current user'})
    findCurrentUser(@CurrentUser() user: any) {
        return this.usersService.findOne(user.sub);
    }

    @Get(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Return user by ID' })
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MANAGER')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated successfully'})
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Delete user (soft delete)'})
    @ApiResponse({ status: 200, description: 'User deleted successfully'})
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
