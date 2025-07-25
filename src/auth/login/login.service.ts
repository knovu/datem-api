import { Injectable } from '@nestjs/common';
import { DeviceInfo, id } from '@src/@types';
import { LoginPayload } from './login.dto';
import { TokenService } from '../token';

@Injectable()
export class LoginService {
    constructor(private readonly tokenService: TokenService) {}

    public async login(userId: id, email: string, device: DeviceInfo): Promise<LoginPayload> {
        // Generate the tokens for the auth payload
        const payload = new LoginPayload();
        const refreshToken = await this.tokenService.createRefreshToken(userId, device);
        payload.refreshToken = refreshToken;

        const accessToken = await this.tokenService.generateAccessToken(userId, email);
        payload.accessToken = accessToken.token;
        payload.expiresIn = accessToken.expiresIn;

        return payload;
    }
}
