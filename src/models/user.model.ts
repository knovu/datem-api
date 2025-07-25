import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { RefreshToken } from './refresh-token.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { Organization } from './organization.model';
import { BaseModel } from '@src/shared';

@ObjectType()
@Entity('Users')
export class User extends BaseModel {
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
