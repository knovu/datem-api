import { PaginationQueryArgs, PaginationResponse } from '@src/schemas';
import { UserSortKeys } from './users-connection.dto';
import { User } from '@src/models';

export class UserPaginationResponse extends PaginationResponse<User, typeof UserSortKeys> {}

export class UserPaginationQuery extends PaginationQueryArgs(UserSortKeys) {}
