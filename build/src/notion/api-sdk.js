// @ts-nocheck
import { Client } from '@notionhq/client';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const VAL_NOTION_API_KEY = process.env.VAL_NOTION_API_KEY;
export const notionClient = new Client({ auth: VAL_NOTION_API_KEY });
export async function getWorkspaceUsers() {
    // https://developers.notion.com/reference/get-users
    try {
        const { results } = await notionClient.users.list();
        return results;
    }
    catch (error) {
        console.error(error);
    }
}
export async function queryWorkspace(string) {
    try {
        return notionClient.search({
            query: string,
        });
    }
    catch (err) {
        console.error(err);
    }
}
export async function findMatchingUser(mention = {}, userDirectory = []) {
    if (!mention) {
        throw new Error('🚨 Please pass a mention object');
    }
    const notionUsers = await getWorkspaceUsers();
    const mentionName = mention.content;
    const mentionLink = mention.link.url;
    if (userDirectory && userDirectory.length > 0) {
        const userIdRegex = /\w+$/gm;
        let profileId;
        const fromUserDirectory = userDirectory.find(({ name = '', profile = '' }) => {
            profileId = mentionLink.match(userIdRegex)[0];
            return profile.includes(profileId);
        });
        if (!fromUserDirectory) {
            return false;
        }
        console.log('PROFILE ID:', profileId);
        console.log('DIRECTORY MATCH:', fromUserDirectory);
        const foundUser = notionUsers.find(({ name }) => fromUserDirectory.name.toUpperCase().includes(name.toUpperCase()));
        return foundUser;
    }
    const foundUser = notionUsers.find(({ name }) => name.toUpperCase() === mentionName.toUpperCase() // case-insensitive
    );
    return foundUser;
}
export async function findMatchingPage(link, options) {
    const { files } = options;
    if (!link) {
        throw new Error('🚨 Please pass a rich text link object');
    }
    const mentionName = link.content;
    const mentionLink = link.link.url;
    const searchQuery = await queryWorkspace(mentionName);
    console.log('QUERY RESULTS:', searchQuery);
    console.log('FILES:', files);
    if (searchQuery.results.length > 1) {
        console.warn('⚠️ The search query returned more than result, the first one will be used.', `May need to check for duplicates: ${JSON.stringify(searchQuery)}`);
    }
    if (files && searchQuery?.results.length === 0) {
        console.log(`Searching folder for matching file: ${mentionName}`);
        // search [files] for a page not found in the notion workspace
        const foundInFolder = files.find(({ filepath }) => {
            // https://nodejs.org/docs/latest-v16.x/api/path.html#pathbasenamepath-ext
            const filename = path.basename(filepath, '.md');
            const hasFileMatch = filename === mentionName;
            return hasFileMatch;
        });
        if (!foundInFolder) {
            return false;
        }
        console.log('FILE MATCH FOUND:', `Mentioned "${mentionName}", matching from ${foundInFolder.filepath}`);
        return { filepath: foundInFolder.filepath };
    }
    if (searchQuery?.results.length > 0) {
        const firstQueryMatch = searchQuery.results[0];
        return { page: firstQueryMatch };
    }
    console.warn('⚠️ No conditions have been matched.');
    return false;
}
//# sourceMappingURL=api-sdk.js.map