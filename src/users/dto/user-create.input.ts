import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType({
    description: 'The input fields to create a user.',
})
export class UserInput {
    @Field({
        description: 'The unique email address of the user.',
    })
    @ApiProperty({
        description: 'The unique email address of the user.',
    })
    @IsEmail(
        {},
        {
            message: 'email is required',
        },
    )
    @MaxLength(256)
    public email: string;

    @Field({
        description: 'The temporary password of the user.',
    })
    @ApiProperty({
        description: 'The temporary password of the user.',
    })
    @IsString({
        message: 'password is required',
    })
    @MinLength(8)
    @MaxLength(256)
    public password: string;

    @Field({
        description: "The user's first name.",
    })
    @ApiProperty({
        description: "The user's first name.",
    })
    @IsString({
        message: 'firstName is required',
    })
    @MinLength(1)
    @MaxLength(256)
    public firstName: string;

    @Field({
        description: "The user's last name.",
    })
    @ApiProperty({
        description: "The user's last name.",
    })
    @IsString({
        message: 'lastName is required',
    })
    @MinLength(1)
    @MaxLength(256)
    public lastName: string;

    @Field({
        description: 'The unique phone number for the user.',
        nullable: true,
    })
    @ApiProperty({
        description: 'The unique phone number for the user.',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(256)
    public phone?: string;

    @Field({
        description: 'The name of the organization for the user.',
    })
    @ApiProperty({
        description: 'The name of the organization for the user.',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(256)
    public organization: string;
}
