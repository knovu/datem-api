import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '@src/models';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './data/sqlite.db', // Path to the SQLite file (ensure it's outside dist folder)
            entities,
            synchronize: false,
            logging: true,
        }),
    ],
})
export class DatabaseModule {}
