import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IMetadata {
    totalCount: number;
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

@ObjectType()
export class Metadata implements IMetadata {
    @Field(() => Int)
    public totalCount: number;

    @Field({ nullable: true })
    public startCursor?: string;

    @Field({ nullable: true })
    public endCursor?: string;

    @Field()
    public hasNextPage: boolean;

    @Field()
    public hasPreviousPage: boolean;

    constructor(info?: IMetadata) {
        if (info) {
            this.totalCount = info.totalCount;
            this.startCursor = info.startCursor;
            this.endCursor = info.endCursor;
            this.hasNextPage = info.hasNextPage;
            this.hasPreviousPage = info.hasPreviousPage;
        }
    }
}
