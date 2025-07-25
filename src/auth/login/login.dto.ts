import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthPayload } from '../common';

@InputType()
export class LoginDto {
    @Field({
        description: 'The email address of the user.',
    })
    @ApiProperty({
        description: 'The email address of the user.',
    })
    @IsEmail(
        {},
        {
            message: 'username is required',
        },
    )
    @MaxLength(256)
    public username: string;

    @Field({
        description: 'The password of the user.',
    })
    @ApiProperty({
        description: 'The password of the user.',
    })
    @IsString({
        message: 'password is required',
    })
    @MinLength(8)
    @MaxLength(256)
    public password: string;
}

@ObjectType()
export class LoginPayload extends AuthPayload {}
