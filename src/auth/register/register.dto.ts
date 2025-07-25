import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthPayload } from '../common';

@InputType()
export class RegisterDto {
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

    @Field({
        description: 'The first name of the user.',
    })
    @ApiProperty({
        description: 'The first name of the user.',
    })
    @IsString({
        message: 'firstName is required',
    })
    @MinLength(1)
    @MaxLength(256)
    public firstName: string;

    @Field({
        description: 'The last name of the user.',
    })
    @ApiProperty({
        description: 'The last name of the user.',
    })
    @IsString({
        message: 'lastName is required',
    })
    @MinLength(1)
    @MaxLength(256)
    public lastName: string;

    @Field({
        description: 'The phone number of the user.',
    })
    @ApiProperty({
        description: 'The phone number of the user.',
    })
    @IsString({
        message: 'phoneNumber is required',
    })
    @MinLength(10)
    @MaxLength(256)
    public phoneNumber: string;

    @Field({
        description: 'The organization of the user.',
    })
    @ApiProperty({
        description: 'The organization of the user.',
    })
    @IsString({
        message: 'organization is required',
    })
    @MinLength(1)
    @MaxLength(256)
    public organization: string;
}

@ObjectType()
export class RegisterPayload extends AuthPayload {}
