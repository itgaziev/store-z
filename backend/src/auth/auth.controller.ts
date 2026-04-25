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

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refreshToken, {
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
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(loginDto);
        this.setCookies(res, result.access_token, result.refresh_token);
        
        const { refresh_token, ...responseData } = result;
        return res.json(responseData);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user'})
    @ApiOkResponse({ description: 'User registered successfully', type: RegisterResponseDto })
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const result = await this.authService.register(registerDto);
        this.setCookies(res, result.access_token, result.refresh_token);
        
        const { refresh_token, ...responseData } = result;
        return res.json(responseData);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh tokens using refresh token from cookie'})
    @ApiOkResponse({ description: 'Tokens refreshed successfully', type: LoginResponseDto })
    async refresh(@Req() req: any, @Res() res: Response) {
        const refreshToken = req.cookies?.refresh_token;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const result = await this.authService.refreshFromToken(refreshToken);
        this.setCookies(res, result.access_token, result.refresh_token);
        
        const { refresh_token, ...responseData } = result;
        return res.json(responseData);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user'})
    @ApiOkResponse({ description: 'User logged out successfully'})
    async logout(@Res() res: Response) {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        return res.json({ message: 'Logged out successfully' });
    }
}
