import { Entity, Column, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from '@src/shared';

@ObjectType()
@Entity('Organizations')
export class Organization extends BaseModel {
    @Field({
        description: 'The name of the organization.',
    })
    @Column('varchar', {
        name: 'Name',
    })
    public name: string;

    @OneToOne(() => User, (user) => user.organization)
    public user: User;
}
