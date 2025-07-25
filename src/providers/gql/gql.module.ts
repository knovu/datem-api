import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Request, Response } from 'express';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            context: ({ req, res }: { req: Request; res: Response }) => ({
                req,
                res,
            }),
            playground: false,
            autoSchemaFile: true, // Automatically generates the schema
            sortSchema: true, // Optional: sorts the schema for better readability
        }),
    ],
})
export class GqlModule {}
