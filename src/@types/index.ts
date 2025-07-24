import { User } from '@src/models';
import { Request, Response } from 'express';
import { IResult } from 'ua-parser-js';

export enum Env {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
}

export interface IConfig {
    env: Env;
    isProduction: boolean;
    port: number;
    jwt: {
        secret: string;
        expiresIn: string;
    };
}

export type id = string | number;

export type CursorListResults<
    TData extends object,
    TSortKeysEnum extends Record<string, string | number>,
> = {
    data: TData[];
    totalCount: number;
    cursorKey: string;
    options: {
        after?: string;
        before?: string;
        first?: number;
        last?: number;
        reverse?: boolean;
        query?: string;
        sortKey?: keyof TSortKeysEnum;
    };
};

export type UserDevice = {
    ipAddress: string;
    userAgent: string;
};

export type GraphQLContext = {
    req: Request;
    res: Response;
    user: User;
};

export interface IPInfo {
    primary: string;
    all: string[];
    ipv4: string;
    ipv6?: string | null;
}

export interface DeviceInfo extends IResult {
    ip: IPInfo;
}

export interface JwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
    jti?: string;
}

export type TokenType = 'Bearer';
