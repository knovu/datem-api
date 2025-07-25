import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@src/models';

@Module({
    imports: [TypeOrmModule.forFeature([Organization])],
    providers: [OrganizationsService],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
