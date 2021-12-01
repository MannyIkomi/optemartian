import { Client } from '@notionhq/client';
import { PersonUser } from '.';
import { pluginConfig } from '../plugin';
export declare const notionClient: Client;
export declare function getWorkspaceUsers(): Promise<import("@notionhq/client/build/src/api-types").User[] | undefined>;
export declare function queryWorkspace(text: string): Promise<import("@notionhq/client/build/src/api-endpoints").SearchResponse | undefined>;
export declare function findMatchingUser(richTextLink: any, options: pluginConfig): Promise<false | PersonUser>;
export declare function findMatchingPage(link: any, options: pluginConfig): Promise<false | {
    filepath: string;
    page?: undefined;
} | {
    page: import("@notionhq/client/build/src/api-types").Page | import("@notionhq/client/build/src/api-types").Database;
    filepath?: undefined;
}>;
