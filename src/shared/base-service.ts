import { id } from '@src/@types';
import {
    DeepPartial,
    FindManyOptions,
    FindOptionsRelations,
    FindOptionsWhere,
    Repository,
} from 'typeorm';
import { BaseModel } from './base-model';
import { NotFoundException } from '@nestjs/common';
import { ExceptionCause } from '@src/constants';

export abstract class BaseService<TEntity extends BaseModel> {
    protected model: Repository<TEntity>;

    public async findAll(options?: FindManyOptions<TEntity> | undefined): Promise<TEntity[]> {
        return await this.model.find(options);
    }

    public async findOne(options: FindOptionsWhere<TEntity>): Promise<TEntity | null> {
        return await this.model.findOneBy(options);
    }

    public async findOneWithRelations(
        options: FindOptionsWhere<TEntity>,
        relations: FindOptionsRelations<TEntity>,
    ): Promise<TEntity | null> {
        return await this.model.findOne({
            relations,
            where: options,
        });
    }

    public async findById(id: id): Promise<TEntity | null> {
        // TODO: Resolve `as` why TypeScript can't infer the base model field here
        return await this.model.findOneBy({
            id,
        } as FindOptionsWhere<TEntity>);
    }

    public async create(entity: DeepPartial<TEntity>): Promise<TEntity> {
        return await this.model.save(entity);
    }

    public async update(entity: DeepPartial<TEntity>): Promise<TEntity> {
        const item = await this.findById(entity.id as id);

        if (!item) {
            throw new NotFoundException('Resource not found to update.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return await this.model.save(entity);
    }

    public async updateOne(
        criteria: FindOptionsWhere<TEntity>,
        entity: DeepPartial<TEntity>,
    ): Promise<TEntity> {
        const item = await this.findOne(criteria);

        if (!item) {
            throw new NotFoundException('Resource not found to update.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        entity.id = item.id;

        return await this.model.save(entity);
    }

    public async deleteById(id: id): Promise<TEntity> {
        const item = await this.findById(id);

        if (!item) {
            throw new NotFoundException('Resource not found to delete.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return await this.model.remove(item);
    }

    public async delete(options: FindOptionsWhere<TEntity>): Promise<TEntity> {
        const item = await this.findOne(options);

        if (!item) {
            throw new NotFoundException('Resource not found to delete.', {
                cause: ExceptionCause.RESOURCE_NOT_FOUND,
            });
        }

        return await this.model.remove(item);
    }
}
