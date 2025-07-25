import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '@src/@types';
import { User } from '@src/models';
import { Request } from 'express';

export const CurrentUser = createParamDecorator((data: keyof User, context: ExecutionContext) => {
    let request: Request;
    let user: User;

    if (context.getType<GqlContextType>() === 'graphql') {
        const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
        user = ctx.req.user as User;
    } else {
        request = context.switchToHttp().getRequest<Request>();
        user = request.user as User;
    }

    if (!user) {
        throw new InternalServerErrorException(
            `Error retrieving current user from request. Expected user, but got ${typeof user}.`,
        );
    }

    return data ? user[data] : user;
});
