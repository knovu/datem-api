import { id } from '@src/@types';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { RefreshToken } from './refresh-token.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Organization } from './organization.model';

@ObjectType()
@Entity('Users')
export class User {
    @Field(() => ID, {
        description: 'A globally-unique ID.',
    })
    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    public id: id;

    @Field({
        description: "The user's email address.",
    })
    @Column('varchar', {
        name: 'Email',
    })
    public email: string;

    @Column('varchar', {
        name: 'Password',
        length: 60,
    })
    public password: string;

    @Field({
        description: "The user's first name.",
    })
    @Column('varchar', {
        name: 'FirstName',
    })
    public firstName: string;

    @Field({
        description: "The user's last name.",
    })
    @Column('varchar', {
        name: 'LastName',
    })
    public lastName: string;

    @Field({ nullable: true, description: "The user's phone number." })
    @Column('varchar', {
        name: 'Phone',
    })
    public phone?: string;

    @Field({
        description: 'The date time when the user was created.',
    })
    @Column('datetime', {
        name: 'CreatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on updates
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

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
        cascade: true,
    })
    public refreshTokens: RefreshToken[];

    @OneToOne(() => Organization, (organization) => organization.user, {
        cascade: true,
    })
    @JoinColumn({ name: 'OrganizationID' })
    public organization: Organization;
}
