import { Config, Env } from '@src/@types';
import { toEnv, toPort } from '@src/utils';

export const config = (): Config => ({
    env: toEnv(process.env.NODE_ENV),
    isProduction: toEnv(process.env.NODE_ENV) === Env.PRODUCTION,
    port: toPort(process.env.PORT),
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
});
