import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { DeviceInfo, id } from '@src/@types';
import { CurrentUser, Device, Public } from '@src/decorators';
import { User } from '@src/models';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto, LoginPayload, LoginService } from './login';
import { LogoutDto, LogoutPayload, LogoutService } from './logout';
import { RegisterDto, RegisterPayload, RegisterService } from './register';
import { LocalAuthGuard } from './common';
import { RefreshTokenDto, RefreshTokenPayload, TokenService } from './token';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginService: LoginService,
        private readonly logoutService: LogoutService,
        private readonly registerService: RegisterService,
        private readonly tokenService: TokenService,
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
    @ApiBody({
        type: LoginDto,
    })
    @Post('login')
    public async login(
        @CurrentUser() user: User,
        @Device() device: DeviceInfo,
    ): Promise<LoginPayload> {
        return await this.loginService.login(user.id, user.email, device);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
    @ApiBody({
        type: RegisterDto,
    })
    @Post('register')
    public async register(
        @Body() body: RegisterDto,
        @Device() device: DeviceInfo,
    ): Promise<RegisterPayload> {
        return await this.registerService.register(body, device);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
    @ApiBody({
        type: RefreshTokenDto,
    })
    @Post('refresh')
    public async refresh(@Body() body: RefreshTokenDto): Promise<RefreshTokenPayload> {
        const { refreshToken } = body;

        return await this.tokenService.generateAccessTokenFromRefreshToken(refreshToken);
    }

    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
    @ApiBody({
        type: LogoutDto,
    })
    @Post('logout')
    public async signOut(
        @CurrentUser('id') id: id,
        @Body() body: LogoutDto,
    ): Promise<LogoutPayload> {
        const { refreshToken } = body;

        return await this.logoutService.logout(id, refreshToken);
    }
}
