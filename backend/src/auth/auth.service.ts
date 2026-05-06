import { UsersService } from '@/users/users.service';
import { ConflictException, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @Inject('JWT_REFRESH_SERVICE') private refreshJwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is not active');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        const { accessToken, refreshToken } = this.issueToken(payload);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = await this.usersService.create({
            email: registerDto.email,
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            roleId: undefined
        });

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        const { accessToken, refreshToken } = this.issueToken(payload);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        };
    }

    async refresh(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        const { accessToken, refreshToken } = this.issueToken(payload);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    async refreshFromToken(token: string) {
        try {
            const payload = await this.refreshJwtService.verifyAsync(token);

            const user = await this.usersService.findOne(payload.sub);

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const newPayload = {
                email: user.email,
                sub: user.id,
                role: user.role,
            };

            const { accessToken, refreshToken } = this.issueToken(newPayload);

            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    private issueToken(payload: any): { accessToken: string; refreshToken: string} {
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') as any;
        const expiresInRefresh = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any;
        const accessToken = this.jwtService.sign(payload, { expiresIn });
        const refreshToken = this.refreshJwtService.sign(payload, { expiresIn: expiresInRefresh });

        return { accessToken, refreshToken };

    }
}
