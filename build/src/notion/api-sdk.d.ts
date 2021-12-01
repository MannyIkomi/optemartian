import { Client } from '@notionhq/client';
import { PersonUser } from '.';
export declare const notionClient: Client;
export declare function getWorkspaceUsers(): Promise<import("@notionhq/client/build/src/api-types").User[] | undefined>;
export declare function findMatchingUser(mention?: {}, userDirectory?: never[]): Promise<false | PersonUser>;
