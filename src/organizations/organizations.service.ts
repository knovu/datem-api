import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@src/shared';
import { Organization } from '@src/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { id } from '@src/@types';
import { ExceptionCause } from '@src/constants';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
    constructor(
        @InjectRepository(Organization)
        organizationModel: Repository<Organization>,
    ) {
        super();
        this.model = organizationModel;
    }

    public async findOneByUserId(userId: id): Promise<Organization> {
        const organization = await this.findOne({
            user: {
                id: userId,
            },
        });

        if (!organization) {
            throw new NotFoundException('Organization resource not found to update.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return organization;
    }
}
