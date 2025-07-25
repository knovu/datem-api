import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getResponseFromContext } from '@src/utils';
import { Response } from 'express';

export const Res = createParamDecorator((_data: unknown, ctx: ExecutionContext): Response => {
    const res = getResponseFromContext(ctx);
    return res;
});
