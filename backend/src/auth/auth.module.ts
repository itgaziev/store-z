import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default-secret',
            signOptions: {
                expiresIn: '15m'
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: 'JWT_REFRESH_SERVICE',
            useFactory: (configService: ConfigService) => {
                return new JwtService({
                    secret: configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
                    signOptions: {
                        expiresIn: '7d'
                    }
                });
            },
            inject: [ConfigService]
        },
    ],
    exports: [AuthService]
})
export class AuthModule { }
