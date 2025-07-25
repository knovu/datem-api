import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceInfo } from '@src/@types';
import { getRequestFromContext } from '@src/utils';

export const Device = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): DeviceInfo | undefined => {
        const req = getRequestFromContext(ctx);
        return req.deviceInfo;
    },
);
