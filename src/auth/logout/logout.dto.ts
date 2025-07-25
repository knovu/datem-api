import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class LogoutDto {
    @Field({
        description:
            'A token that can be used to obtain new access tokens. This token has an unlimited lifetime until it is revoked by the end-user.',
    })
    @ApiProperty({
        description:
            'A token that can be used to obtain new access tokens. This token has an unlimited lifetime until it is revoked by the end-user.',
    })
    @IsString({
        message: 'refreshToken is required',
    })
    @MaxLength(64)
    public refreshToken: string;
}

@ObjectType()
export class LogoutPayload {
    @Field({
        description: 'Returns boolean value if token is revoked successfully',
    })
    @ApiProperty({
        description: 'Returns boolean value if token is revoked successfully',
    })
    public success: boolean;
}
