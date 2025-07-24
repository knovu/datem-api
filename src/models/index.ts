import { EntitySchema, MixedList } from 'typeorm';
import { User } from './user.model';
import { RefreshToken } from './refresh-token.model';
import { Organization } from './organization.model';

// Bootstrap entities for database models
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const entities: MixedList<string | Function | EntitySchema<any>> | undefined = [
    Organization,
    RefreshToken,
    User,
];

export { entities, Organization, RefreshToken, User };
