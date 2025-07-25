import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class RefreshTokenDto {
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
export class RefreshTokenPayload {
    @Field({
        description:
            'A token that is sent to the resource server to access the protected resources of the user.',
    })
    @ApiProperty({
        description:
            'A token that is sent to the resource server to access the protected resources of the user..',
    })
    public accessToken: string;

    @Field({
        description:
            'A token that is sent to the resource server to access the protected resources of the user.',
    })
    @ApiProperty({
        description:
            'A token that is sent to the resource server to access the protected resources of the user..',
        default: 'Bearer',
    })
    public tokenType: string = 'Bearer';

    @Field({
        description: 'Expiration time in milliseconds of the access token',
    })
    @ApiProperty({
        description: 'Expiration time in milliseconds of the access token',
    })
    public expiresIn: number;
}
