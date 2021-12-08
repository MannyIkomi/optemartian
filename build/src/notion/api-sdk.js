import { Client } from '@notionhq/client';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const VAL_NOTION_API_KEY = process.env.VAL_NOTION_API_KEY;
const DISCORD_API_KEY = process.env.DISCORD_API_KEY;
export const notionClient = new Client({
    auth: DISCORD_API_KEY || VAL_NOTION_API_KEY,
});
export async function getWorkspaceUsers() {
    // https://developers.notion.com/reference/get-users
    try {
        // const currentUsers = users || ([] as User[]);
        const { results, has_more, next_cursor } = await notionClient.users.list();
        let allUsers = results;
        let cursor = next_cursor || undefined;
        let more = has_more;
        do {
            console.log('🔁 Getting more users…', `Currently ${allUsers.length}`);
            // list needs to be paginated
            // getWorkspaceUsers again with the cursor
            const moreUsers = await notionClient.users.list({
                start_cursor: cursor,
            });
            cursor = moreUsers.next_cursor || undefined;
            more = moreUsers.has_more;
            allUsers = allUsers.concat(moreUsers.results);
        } while (more && cursor);
        console.log('✅ Got all users:', allUsers.length, allUsers);
        return Promise.all(allUsers);
    }
    catch (err) {
        console.error(err);
        return;
    }
}
export async function queryWorkspace(text) {
    try {
        return notionClient.search({
            query: text,
        });
    }
    catch (err) {
        console.error(err);
        return;
    }
}
let notionUsers = [];
export async function findMatchingUser(richTextLink, options) {
    const { userDirectory } = options;
    if (!richTextLink) {
        throw new Error('🚨 Please pass a mention object');
    }
    const allUsers = notionUsers?.length === 0 ? await getWorkspaceUsers() : notionUsers;
    notionUsers = allUsers;
    const mentionName = richTextLink?.content;
    const mentionLink = richTextLink?.link.url;
    if (userDirectory && userDirectory.length > 0) {
        const userIdRegex = /\w+$/gm;
        let profileId = mentionLink.match(userIdRegex)[0];
        const fromUserDirectory = userDirectory.find(({ profile }) => {
            return profile.includes(profileId);
        });
        if (!fromUserDirectory) {
            return false;
        }
        console.log('DIRECTORY MATCH:', profileId, fromUserDirectory);
        console.log(`Notion users: ${notionUsers?.length}`);
        const foundUser = notionUsers?.find(user => {
            //@ts-ignore
            const { name, person } = user;
            // console.log('PERSON', person);
            if (!person) {
                console.warn('Notion did not return a {person} with the User object');
                return false;
            }
            // return fromUserDirectory.name.toUpperCase().includes(name.toUpperCase());
            return (fromUserDirectory.email.toUpperCase() === person.email.toUpperCase());
        });
        console.log('FINAL MATCH:', profileId, foundUser);
        return foundUser;
    }
    const foundUser = notionUsers?.find(({ name }) => name?.toUpperCase() === mentionName.toUpperCase() // case-insensitive
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
    if (searchQuery && searchQuery.results.length > 1) {
        console.warn(`⚠️ The search query returned more than result for "${mentionName}", the first one will be used.`, `May need to check for duplicates: ${JSON.stringify(searchQuery)}`);
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
    if (searchQuery && searchQuery.results.length > 0) {
        const firstQueryMatch = searchQuery?.results[0];
        return { page: firstQueryMatch };
    }
    console.warn('⚠️ No conditions have been matched.');
    return false;
}
//# sourceMappingURL=api-sdk.js.map