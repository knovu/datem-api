import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { id } from '@src/@types';
import { LogoutPayload } from './logout.dto';
import { TokenService } from '../token';
import { ExceptionCause } from '@src/constants';
import { isError } from 'lodash';

@Injectable()
export class LogoutService {
    constructor(private readonly tokenService: TokenService) {}

    public async logout(userId: id, refreshToken: string): Promise<LogoutPayload> {
        const payload = new LogoutPayload();

        try {
            payload.success = await this.tokenService.revokeRefreshToken(userId, refreshToken);
        } catch (err: unknown) {
            if (err instanceof NotFoundException) {
                throw new UnauthorizedException('Invalid token', {
                    cause: ExceptionCause.INVALID_TOKEN,
                });
            }

            const errorMessage: string = `Could not logout user. ${isError(err) ? err.message : 'Unknown error occurred.'}`;

            Logger.error(errorMessage, 'LogoutService');

            payload.success = false;
        }

        return payload;
    }
}
