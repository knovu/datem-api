import { Args, ID, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { Organization, User } from '@src/models';
import { UsersService } from './users.service';
import { id } from '@src/@types';
import {
    UserConnection,
    UserConnectionArgs,
    UserDeleteInput,
    UserDeletePayload,
    UserInput,
} from './dto';
import { NotFoundException } from '@nestjs/common';
import { ExceptionCause } from '@src/constants';
import { CurrentUser, Public } from '@src/decorators';
import { OrganizationsService } from '@src/organizations';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly organizationsService: OrganizationsService,
    ) {}

    @Mutation(() => User, {
        name: 'userCreate',
    })
    public async createUser(
        @Args('input', { type: () => UserInput }) input: UserInput,
    ): Promise<User> {
        return await this.usersService.create(input);
    }

    @Query(() => User)
    public async user(
        @CurrentUser('id') currentUserId: id,
        @Args('id', { type: () => ID, nullable: true }) id?: id,
    ): Promise<User> {
        const user = await this.usersService.findOneById(id ? id : currentUserId);

        if (!user) {
            throw new NotFoundException('User with the provided id not found.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return user;
    }

    @Public()
    @Query(() => Boolean)
    public async usernameExists(@Args('username') username: string): Promise<boolean> {
        const user = await this.usersService.findOneByEmail(username);

        if (user) {
            return true;
        }

        return false;
    }

    @Query(() => UserConnection)
    public async users(@Args() args: UserConnectionArgs): Promise<UserConnection> {
        const results = await this.usersService.getUsers(args);

        const connection = new UserConnection({
            data: results.data,
            totalCount: results.totalCount,
            cursorKey: results.cursorKey,
            args: results.options,
        });

        return connection;
    }

    @Mutation(() => UserDeletePayload, {
        name: 'userDelete',
    })
    public async deleteUser(
        @Args('input', { type: () => UserDeleteInput }) input: UserDeleteInput,
    ): Promise<UserDeletePayload> {
        return await this.usersService.delete(input);
    }

    @ResolveField(() => Organization, {
        name: 'organization',
    })
    public async organization(@Root() user: User): Promise<Organization> {
        const organization = await this.organizationsService.findOneByUserId(user.id);

        return organization;
    }
}
