import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Env, GraphQLContext } from '../@types';
import { Request, Response } from 'express';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

/**
 * Converts a given string value to a valid port number.
 * If the value is not a string, not a valid number, or not within
 * the acceptable port range (0 to 65535), it throws an error.
 *
 * @param value - The string value representing the port.
 * @returns The valid port number as a number type.
 * @throws Will throw an error if the input is not a string, not a valid number,
 *         or not within the port range.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toPort = (value?: any): number => {
    const MAX_PORT = 65535;
    const MIN_PORT = 0;

    // Check if the value is not a string
    if (typeof value !== 'string') {
        throw new Error('Port value must be a string');
    }

    // Attempt to convert the string to a number
    const port = Number(value);

    // Check if the converted port is a valid number
    if (isNaN(port)) {
        throw new Error('Port value must be a valid number');
    }

    // Check if the port is within the valid range
    if (port < MIN_PORT || port > MAX_PORT) {
        throw new Error(`Port value must be between ${MIN_PORT} and ${MAX_PORT}`);
    }

    // Return the valid port number
    return port;
};

/**
 * Converts a given value to an environment type.
 * If the value does not match the expected criteria,
 * it defaults to `development`.
 *
 * @param value - The input value to be converted to an environment.
 * @returns The corresponding Env type, defaults to Env.DEVELOPMENT if the value is unsupported.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toEnv = (value: any): Env => {
    // Use a switch-case for clarity in handling different environment values
    switch (value) {
        case 'PRODUCTION':
        case 'production':
            return Env.PRODUCTION;

        case 'DEVELOPMENT':
        case 'development':
            return Env.DEVELOPMENT;

        default:
            throw new Error(`Unsupported environment value: ${value}. Defaulting to development.`);
    }
};

export const base64EncryptCursor = (cursor: string): string => {
    const buffer = Buffer.from(cursor, 'utf-8'); // Convert the cursor string to a Buffer
    return buffer.toString('base64'); // Convert the buffer to a base64 string
};

export const base64DecryptCursor = (encodedCursor: string): string => {
    const buffer = Buffer.from(encodedCursor, 'base64'); // Convert the base64 string to a Buffer
    return buffer.toString('utf-8'); // Convert the buffer back to a string (UTF-8)
};

export function validatePaginationArgs(args: {
    before?: string;
    after?: string;
    first?: number;
    last?: number;
}) {
    // Check if both `before` and `after` are provided
    if (args.before && args.after) {
        throw new BadRequestException(
            'You cannot pass both "before" and "after" in the same query.',
        );
    }

    // If both `first` and `last` are provided, it can be a conflicting request, so we can validate them
    if (args.first && args.last) {
        throw new BadRequestException('You cannot pass both "first" and "last" in the same query.');
    }

    // If "before" is passed, ensure "last" is provided
    if (args.before && !args.last) {
        throw new BadRequestException(
            'You must provide "last" when using "before" for pagination.',
        );
    }

    // If "after" is passed, ensure "first" is provided
    if (args.after && !args.first) {
        throw new BadRequestException(
            'You must provide "first" when using "after" for pagination.',
        );
    }

    // Valid pagination arguments, return true (or proceed as needed)
    return true;
}

export function isGraphQLRequest(ctx: ExecutionContext): boolean {
    let isGraphQL: boolean = false;

    if (ctx.getType<GqlContextType>() === 'graphql') {
        isGraphQL = true;
    }

    return isGraphQL;
}

export function getRequestFromContext(ctx: ExecutionContext): Request {
    let request: Request;

    if (ctx.getType<GqlContextType>() === 'graphql') {
        const context = GqlExecutionContext.create(ctx).getContext<GraphQLContext>();
        request = context.req;
    } else {
        request = ctx.switchToHttp().getRequest<Request>();
    }

    return request;
}

export function getResponseFromContext(ctx: ExecutionContext): Response {
    let response: Response;

    if (ctx.getType<GqlContextType>() === 'graphql') {
        const context = GqlExecutionContext.create(ctx).getContext<GraphQLContext>();
        response = context.res;
    } else {
        response = ctx.switchToHttp().getResponse<Response>();
    }

    return response;
}
