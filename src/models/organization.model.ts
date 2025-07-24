import { id } from '@src/@types';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
@Entity('Organizations')
export class Organization {
    @Field(() => ID, {
        description: 'A globally-unique ID.',
    })
    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    public id: id;

    @Field({
        description: 'The name of the organization.',
    })
    @Column('varchar', {
        name: 'Name',
    })
    public name: string;

    @Field({
        description: 'The date time when the organization was created.',
    })
    @Column('datetime', {
        name: 'CreatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on updates
    })
    public createdAt: Date;

    @Field({
        description: 'The date time when the organization was last updated.',
    })
    @Column('datetime', {
        name: 'UpdatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on updates
    })
    public updatedAt: Date;

    @OneToOne(() => User, (user) => user.organization)
    public user: User;
}
