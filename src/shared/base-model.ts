import { id } from '@src/@types';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseModel {
    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    public id: id;

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
}
