import { Client } from '@notionhq/client';
import { PersonUser } from '.';
export declare const notionClient: Client;
export declare function getWorkspaceUsers(): Promise<import("@notionhq/client/build/src/api-types").User[] | undefined>;
export declare function queryWorkspace(string: String): Promise<import("@notionhq/client/build/src/api-endpoints").SearchResponse | undefined>;
export declare function findMatchingUser(mention?: {}, userDirectory?: never[]): Promise<false | PersonUser>;
export declare function findMatchingPage(link: any, options: any): Promise<false | {
    filepath: any;
    page?: undefined;
} | {
    page: import("@notionhq/client/build/src/api-types").Page | import("@notionhq/client/build/src/api-types").Database;
    filepath?: undefined;
}>;
