import { Injectable } from '@nestjs/common';
import { RegisterDto, RegisterPayload } from './register.dto';
import { UsersService } from '@src/users';
import { TokenService } from '../token';
import { DeviceInfo } from '@src/@types';

@Injectable()
export class RegisterService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
    ) {}

    public async register(criteria: RegisterDto, device: DeviceInfo): Promise<RegisterPayload> {
        const { username, password, firstName, lastName, phoneNumber, organization } = criteria;

        const user = await this.userService.create({
            email: username,
            password,
            firstName,
            lastName,
            phone: phoneNumber,
            organization,
        });

        // Generate the tokens for the auth payload
        const payload = new RegisterPayload();
        const refreshToken = await this.tokenService.createRefreshToken(user.id, device);
        payload.refreshToken = refreshToken;

        const accessToken = await this.tokenService.generateAccessToken(user.id, user.email);
        payload.accessToken = accessToken.token;
        payload.expiresIn = accessToken.expiresIn;

        return payload;
    }
}
