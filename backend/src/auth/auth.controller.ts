import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService,
    ) { }

    private setCookies(res: Response, refreshToken: string) {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user'})
    @ApiOkResponse({ description: 'User logged in successfully', type: LoginResponseDto })
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);
        this.setCookies(res, result.refreshToken);
        
        const { refreshToken: _, ...responseData } = result;
        return responseData;
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user'})
    @ApiOkResponse({ description: 'User registered successfully', type: RegisterResponseDto })
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(registerDto);

        return result;
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh tokens using refresh token from cookie'})
    @ApiOkResponse({ description: 'Tokens refreshed successfully', type: LoginResponseDto })
    async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        
        if (!refreshToken) {
            res.status(401).clearCookie('refreshToken', { path: '/' });
            return { message: 'Refresh token not found' };
        }

        const result = await this.authService.refreshFromToken(refreshToken);
        this.setCookies(res, result.refreshToken);
        
        const { refreshToken: _, ...responseData } = result;
        return responseData;
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user'})
    @ApiOkResponse({ description: 'User logged out successfully'})
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', { path: '/' });
        return { message: 'Logged out successfully' };
    }
}
