import { Field, ID } from '@nestjs/graphql';
import { id } from '@src/@types';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseModel {
    @Field(() => ID, {
        description: 'A globally-unique ID.',
    })
    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    public id: id;

    @Field({
        description: 'The date time when the user was created.',
    })
    @Column('datetime', {
        name: 'CreatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on create
    })
    public createdAt: Date;

    @Field({
        description: 'The date time when the user was last updated.',
    })
    @Column('datetime', {
        name: 'UpdatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on updates
    })
    public updatedAt: Date;
}
