import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@src/models';
import { id } from '@src/@types';
import { ExceptionCause } from '@src/constants';
import {
    UserDeleteInput,
    UserDeletePayload,
    UserInput,
    UserPaginationQuery,
    UserPaginationResponse,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    public async createUser(@Body() body: UserInput): Promise<User> {
        return await this.usersService.create(body);
    }

    @Get(':id')
    public async findById(@Param('id') id: id): Promise<User> {
        const user = await this.usersService.findOneById(id);

        if (!user) {
            throw new NotFoundException('User with the provided id not found.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return user;
    }

    @Get()
    public async listUsers(@Query() query: UserPaginationQuery): Promise<UserPaginationResponse> {
        const results = await this.usersService.getUsers(query);

        const response = new UserPaginationResponse({
            data: results.data,
            totalCount: results.totalCount,
            cursorKey: results.cursorKey,
            query: results.options,
        });

        return response;
    }

    @Delete()
    public async deleteUser(@Body() body: UserDeleteInput): Promise<UserDeletePayload> {
        return await this.usersService.delete(body);
    }
}
