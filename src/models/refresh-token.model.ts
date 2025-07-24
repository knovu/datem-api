import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';
import { BaseModel } from '@src/shared';

@Entity('RefreshTokens')
export class RefreshToken extends BaseModel {
    @Column('varchar', {
        name: 'Token',
    })
    public token: string;

    @Column('boolean', {
        name: 'Revoked',
        default: false,
    })
    public revoked: boolean;

    @Column('varchar', {
        name: 'IPAddress',
    })
    public ipAddress: string;

    @Column('text', {
        name: 'UserAgent',
    })
    public userAgent: string;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'UserID' })
    public user: User;
}
