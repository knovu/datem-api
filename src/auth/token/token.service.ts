import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DeviceInfo, id } from '@src/@types';
import ms from 'ms';
import { Repository } from 'typeorm';
import { RefreshToken, User } from '@src/models';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/shared';
import { ExceptionCause } from '@src/constants';
import { UsersService } from '@src/users';
import { RefreshTokenPayload } from './token.dto';

@Injectable()
export class TokenService extends BaseService<RefreshToken> {
    constructor(
        @InjectRepository(RefreshToken)
        refreshTokenModel: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super();

        this.model = refreshTokenModel;
    }

    public async generateAccessTokenFromRefreshToken(
        refreshToken: string,
    ): Promise<RefreshTokenPayload> {
        const payload = new RefreshTokenPayload();

        // Validate the refresh token is still valid
        const token = await this.findOneWithRelations(
            {
                token: refreshToken,
                revoked: false,
            },
            {
                user: true,
            },
        );

        if (!token || token.revoked) {
            throw new UnauthorizedException('Invalid token.', {
                cause: ExceptionCause.INVALID_TOKEN,
            });
        }

        const user = await this.usersService.findOneById(token.user.id);

        const accessToken = await this.generateAccessToken(user!.id, user!.email);
        payload.accessToken = accessToken.token;
        payload.expiresIn = accessToken.expiresIn;

        return payload;
    }

    public async generateAccessToken(
        userId: id,
        username: string,
    ): Promise<{ token: string; expiresIn: number }> {
        const token = await this.jwtService.signAsync({
            sub: userId,
            username,
        });

        const expiresIn = this.configService.get<string>('jwt.expiresIn');

        if (!expiresIn) {
            throw new InternalServerErrorException(
                `Expected expiresIn for access tokens, but got ${typeof expiresIn}`,
            );
        }

        const expiresInMilliseconds = ms(expiresIn);

        return {
            token,
            expiresIn: expiresInMilliseconds,
        };
    }

    public async revokeRefreshToken(userId: id, refreshToken: string): Promise<boolean> {
        const revokedRefreshToken = await this.updateOne(
            {
                token: refreshToken,
                revoked: false,
                user: {
                    id: userId,
                },
            },
            {
                revoked: true,
            },
        );

        return revokedRefreshToken.revoked;
    }

    public async createRefreshToken(userId: id, device: DeviceInfo): Promise<string> {
        const token = await this.generateRefreshToken();
        const user = new User();
        user.id = userId;

        const refreshToken = new RefreshToken();
        refreshToken.token = token;
        refreshToken.ipAddress = device.ip.primary;
        refreshToken.userAgent = device.ua;
        refreshToken.user = user;

        // Store the hashed token in the database
        await this.create(refreshToken);

        // Step 4: Return the raw token to the user (for storage on the client-side)
        return token;
    }

    /**
     * Generate a new refresh token (random string)
     */
    private async generateRefreshToken(): Promise<string> {
        return crypto.randomBytes(32).toString('hex'); // Generates a 64-character token
    }
}
