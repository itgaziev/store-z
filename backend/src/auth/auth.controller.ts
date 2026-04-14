import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user'})
    @ApiResponse({ status: 200, description: 'Return access token'})
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user'})
    @ApiResponse({ status: 201, description: 'User registered successfully'})
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('refresh')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token'})
    @ApiResponse({ status: 200, description: 'Return new access token'})
    async refresh(@Request() req: any) {
        return this.authService.refresh(req.user);
    }
}
