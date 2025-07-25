import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from '@src/utils';
import { Request } from 'express';

export const Req = createParamDecorator((_data: unknown, ctx: ExecutionContext): Request => {
    const req = getRequestFromContext(ctx);
    return req;
});
