import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user'})
    @ApiOkResponse({ description: 'User logged in successfully', type: LoginResponseDto })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user'})
    @ApiOkResponse({ description: 'User registered successfully', type: RegisterResponseDto })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('refresh')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token'})
    @ApiOkResponse({ description: 'Access token refreshed successfully', type: LoginResponseDto })
    async refresh(@Request() req: any) {
        return this.authService.refresh(req.user);
    }
}
