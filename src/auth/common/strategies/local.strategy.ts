import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@src/models';
import { UsersService } from '@src/users';
import { ExceptionCause } from '@src/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super();
    }

    public async validate(username: string, password: string): Promise<User> {
        const user = await this.validateCredentials(username, password);

        return user;
    }

    private async validateCredentials(username: string, password: string): Promise<User> {
        const user = await this.usersService.findOneByEmail(username);

        if (!user) {
            throw new UnauthorizedException('Invalid login. This user does not exist.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        const isValidPassword = await this.usersService.comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid login. This password is incorrect', {
                cause: ExceptionCause.INVALID_PASSWORD,
            });
        }

        return user;
    }
}
