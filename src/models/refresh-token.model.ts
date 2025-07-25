import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { id } from '@src/@types';

@Entity('RefreshTokens')
export class RefreshToken {
    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    public id: id;

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

    @Column('datetime', {
        name: 'CreatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on create
    })
    public createdAt: Date;

    @Column('datetime', {
        name: 'UpdatedAt',
        default: () => 'CURRENT_TIMESTAMP', // Use SQL's CURRENT_TIMESTAMP
        onUpdate: 'CURRENT_TIMESTAMP', // Automatically update on updates
    })
    public updatedAt: Date;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'UserID' })
    public user: User;
}
