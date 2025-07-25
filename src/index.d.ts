import { Request } from 'express';
import { DeviceInfo } from './@types';
import { User } from './models';

declare global {
    namespace Express {
        interface Request {
            deviceInfo?: DeviceInfo;
            user: User;
        }

        interface Response {
            req: Request & {
                deviceInfo?: DeviceInfo;
                user: User;
            };
        }
    }
}
