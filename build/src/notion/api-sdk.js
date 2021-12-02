// @ts-nocheck
import { Client } from '@notionhq/client';
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
//# sourceMappingURL=api-sdk.js.map