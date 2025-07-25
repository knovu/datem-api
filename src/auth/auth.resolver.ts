import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeviceInfo, id } from '@src/@types';
import { Device, Public } from '@src/decorators';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '@src/decorators/current-user';
import { User } from '@src/models';
import { LoginDto, LoginPayload, LoginService } from './login';
import { LogoutDto, LogoutPayload, LogoutService } from './logout';
import { RegisterDto, RegisterPayload, RegisterService } from './register';
import { RefreshTokenDto, RefreshTokenPayload, TokenService } from './token';
import { LocalAuthGuard } from './common';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly loginService: LoginService,
        private readonly logoutService: LogoutService,
        private readonly registerService: RegisterService,
        private readonly tokenService: TokenService,
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Mutation(() => LoginPayload, {
        name: 'login',
        description:
            'Authenticates users by validating their credentials and returning an access and refresh token.',
    })
    public async login(
        @CurrentUser() user: User,
        @Device() device: DeviceInfo,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Args('input') _input: LoginDto,
    ): Promise<LoginPayload> {
        return this.loginService.login(user.id, user.email, device);
    }

    @Public()
    @Mutation(() => RegisterPayload, {
        name: 'register',
        description: 'Registers a new user with their own organization.',
    })
    public async register(
        @Device() device: DeviceInfo,
        @Args('input') input: RegisterDto,
    ): Promise<RegisterPayload> {
        return this.registerService.register(input, device);
    }

    @Public()
    @Mutation(() => RefreshTokenPayload, {
        name: 'refresh',
        description: 'Returns a new access token.',
    })
    public async refresh(@Args('input') input: RefreshTokenDto): Promise<RefreshTokenPayload> {
        const { refreshToken } = input;

        return await this.tokenService.generateAccessTokenFromRefreshToken(refreshToken);
    }

    @Mutation(() => LogoutPayload, {
        name: 'logout',
        description: 'Revokes the refresh token.',
    })
    public async logout(
        @CurrentUser('id') id: id,
        @Args('input') input: LogoutDto,
    ): Promise<LogoutPayload> {
        const { refreshToken } = input;

        return await this.logoutService.logout(id, refreshToken);
    }
}
