import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { base64EncryptCursor } from '@src/utils';
import { Metadata } from './metadata.schema';
import { IsOptional, Min } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export interface IEdge<T extends any> {
    cursor: string;
    node: T;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function Edge<T extends Function>(nodeType: T) {
    @ObjectType({ isAbstract: true })
    abstract class AbstractEdge implements IEdge<T> {
        @Field(() => String)
        public cursor: string;

        @Field(() => nodeType)
        public node: T; // Ensure nodeType is passed correctly to @Field decorator
    }

    return AbstractEdge;
}

export interface ConnectionOptions<TData extends object, TSortKeys extends object = any> {
    data: TData[];
    totalCount: number;
    cursorKey: string;
    args: IConnectionArgs<TSortKeys>;
}

// Connection Factory with Edge
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function Connection<T extends { new (...args: any[]): {} }>(nodeType: T) {
    const EdgeType = Edge(nodeType); // Get the Edge class for the nodeType

    @ObjectType({ isAbstract: true })
    abstract class AbstractConnection {
        @Field(() => [EdgeType])
        public edges: Array<typeof EdgeType> = []; // The edges array will be of the Edge type

        @Field()
        public metadata: Metadata = new Metadata();

        constructor(options: ConnectionOptions<InstanceType<T>>) {
            const {
                data,
                totalCount,
                cursorKey,
                args: { first, last },
            } = options;

            this.edges = Array.isArray(data)
                ? (data.map((node) => ({
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      cursor: base64EncryptCursor(String(node[cursorKey as keyof T])),
                      node,
                  })) as unknown as Array<typeof EdgeType>)
                : [];

            this.metadata.totalCount = totalCount;
            this.metadata.startCursor = (
                this.edges[this.edges.length - 1] as unknown as IEdge<T>
            ).cursor;
            this.metadata.endCursor = (
                this.edges[this.edges.length - 1] as unknown as IEdge<T>
            ).cursor;
            this.metadata.hasNextPage =
                first != undefined
                    ? this.edges.length === first && this.edges.length < totalCount
                    : false;
            this.metadata.hasPreviousPage =
                last != undefined
                    ? this.edges.length === last && this.edges.length < totalCount
                    : false;
        }
    }

    return AbstractConnection;
}

export interface IConnectionArgs<TSortKeys extends object> {
    after?: string;
    before?: string;
    first?: number;
    last?: number;
    reverse?: boolean;
    query?: string;
    sortKey?: keyof TSortKeys;
}

export function ConnectionArgs<TSortKeys extends object>(sortKeys: TSortKeys) {
    @ArgsType()
    abstract class AbstractConnectionArgs {
        @Field({
            description: 'The elements that come after the specified cursor.',
            nullable: true,
        })
        public after?: string;

        @Field({
            description: 'The elements that come before the specified cursor.',
            nullable: true,
        })
        public before?: string;

        @Field(() => Int, {
            description: 'The first n elements from the paginated list.',
            nullable: true,
        })
        @IsOptional()
        @Min(1)
        public first?: number;

        @Field(() => Int, {
            description: 'The last n elements from the paginated list.',
            nullable: true,
        })
        @IsOptional()
        @Min(1)
        public last?: number;

        @Field({
            description:
                'A filter made up of terms, connectives, modifiers, and comparators. You can apply one or more filters to a query.',
            nullable: true,
        })
        public query?: string;

        @Field({
            description: 'Reverse the order of the underlying list.',
            nullable: true,
        })
        public reverse?: boolean;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @Field(() => sortKeys, {
            description: 'Sort the underlying list using a key.',
            nullable: true,
        })
        public sortKey?: keyof TSortKeys;
    }

    return AbstractConnectionArgs;
}
