import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CursorListResults, id } from '@src/@types';
import { Organization, User } from '@src/models';
import { FindOptionsOrder, LessThan, MoreThan, Repository } from 'typeorm';
import {
    UserConnectionArgs,
    UserDeleteInput,
    UserDeletePayload,
    UserInput,
    UserSortKeys,
} from './dto';
import { base64DecryptCursor, validatePaginationArgs } from '@src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCause } from '@src/constants';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async create(input: UserInput): Promise<User> {
        const { email, password, firstName, lastName, phone, organization } = input;

        const existingUser = await this.findOneByEmail(email);

        if (existingUser) {
            throw new BadRequestException('User already exists with this email.', {
                cause: ExceptionCause.USERNAME_ALREADY_EXISTS,
            });
        }

        const passwordHash = await this.createHash(password);

        const org = new Organization();
        org.name = organization;

        const user = new User();
        user.email = email;
        user.password = passwordHash;
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.organization = org;

        const createdUser = await this.userRepository.save(user).then(async (data) => {
            const user = await this.userRepository.findOne({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    organization: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                where: {
                    id: data.id,
                },
            });

            if (!user) {
                throw new NotFoundException('Created user with the provided id not found.', {
                    cause: ExceptionCause.RESOURCE_NOT_FOUND,
                });
            }

            return user;
        });

        return createdUser;
    }

    public async findOneById(id: id): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            id,
        });

        return user;
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            email,
        });

        return user;
    }

    public async getUsers(
        args: UserConnectionArgs,
    ): Promise<CursorListResults<User, typeof UserSortKeys>> {
        const { first, last, reverse, sortKey, ...rest } = args;
        const afterId = rest.after ? parseInt(base64DecryptCursor(rest.after)) : undefined;
        const beforeId = rest.before ? parseInt(base64DecryptCursor(rest.before)) : undefined;

        // Validate the pagination args
        validatePaginationArgs(args);

        const order: FindOptionsOrder<User> = {};

        if (sortKey) {
            switch (sortKey) {
                case UserSortKeys.EMAIL: {
                    order.email = reverse ? 'desc' : 'asc';
                    break;
                }
                case UserSortKeys.FIRST_NAME: {
                    order.firstName = reverse ? 'desc' : 'asc';
                    break;
                }
                case UserSortKeys.LAST_NAME: {
                    order.lastName = reverse ? 'desc' : 'asc';
                    break;
                }
                case UserSortKeys.PHONE: {
                    order.phone = reverse ? 'desc' : 'asc';
                    break;
                }
                case UserSortKeys.CREATED_AT: {
                    order.createdAt = reverse ? 'desc' : 'asc';
                    break;
                }
                case UserSortKeys.UPDATED_AT: {
                    order.updatedAt = reverse ? 'desc' : 'asc';
                    break;
                }
            }

            order.id = reverse ? 'desc' : 'asc';
        } else {
            order.id = last ? (reverse ? 'asc' : 'desc') : reverse ? 'desc' : 'asc';
        }

        const [users, totalCount] = await this.userRepository.findAndCount({
            take: first || last,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
            },
            where: [
                {
                    id: afterId ? MoreThan(afterId) : undefined,
                },
                {
                    id: beforeId ? LessThan(beforeId) : undefined,
                },
            ],
            order: {
                ...order,
                id: last ? (reverse ? 'asc' : 'desc') : reverse ? 'desc' : 'asc',
            },
        });

        return {
            data: users,
            totalCount,
            cursorKey: 'id',
            options: args,
        };
    }

    public async delete(input: UserDeleteInput): Promise<UserDeletePayload> {
        const { id } = input;

        const user = await this.findOneById(id);

        if (!user) {
            throw new NotFoundException('User with the provided id not found.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        const deletedUserId = user.id;
        const payload = await this.userRepository.remove(user).then(() => {
            const data = new UserDeletePayload();
            data.deletedUserId = deletedUserId;
            return data;
        });

        return payload;
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public async createHash(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}
