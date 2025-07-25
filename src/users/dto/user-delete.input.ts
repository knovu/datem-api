import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { id } from '@src/@types';

@InputType({
    description: 'Specifies the user to delete.',
})
export class UserDeleteInput {
    @Field(() => ID, {
        description: 'The ID of the user to delete.',
    })
    @ApiProperty({
        description: 'The ID of the user to delete.',
    })
    public id: id;
}

@ObjectType()
export class UserDeletePayload {
    @Field(() => ID, {
        description: 'The ID of the deleted customer.',
    })
    @ApiProperty({
        description: 'The ID of the deleted customer.',
    })
    public deletedUserId: id;
}
