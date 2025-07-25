import { Connection, ConnectionArgs } from '@src/schemas';
import { ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '@src/models';

export enum UserSortKeys {
    ID = 'ID',
    FIRST_NAME = 'FIRST_NAME',
    LAST_NAME = 'LAST_NAME',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    CREATED_AT = 'CREATED_AT',
    UPDATED_AT = 'UPDATED_AT',
}

registerEnumType(UserSortKeys, {
    name: 'UserSortKeys',
    description: 'Sort the underlying list using a key.',
});

@ObjectType()
export class UserConnection extends Connection(User) {}

@ArgsType() // Ensuring the generated class is treated as an @ArgsType
export class UserConnectionArgs extends ConnectionArgs(UserSortKeys) {}
