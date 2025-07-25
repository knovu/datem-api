import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from '@src/organizations';
import { User } from '@src/models';

@Module({
    imports: [TypeOrmModule.forFeature([User]), OrganizationsModule], // Ensure User entity is registered here
    controllers: [UsersController],
    providers: [UsersResolver, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
