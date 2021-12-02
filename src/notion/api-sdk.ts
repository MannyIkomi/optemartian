import {Client} from '@notionhq/client';
import path from 'path';
import dotenv from 'dotenv';
import {PageMention, PersonUser, RichTextText, RichText} from '.';
import {PluginConfig} from '../plugin';
dotenv.config();

const VAL_NOTION_API_KEY = process.env.VAL_NOTION_API_KEY;

export const notionClient = new Client({auth: VAL_NOTION_API_KEY});

export async function getWorkspaceUsers() {
  // https://developers.notion.com/reference/get-users
  try {
    const {results} = await notionClient.users.list();
    return results;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function queryWorkspace(text: string) {
  try {
    return notionClient.search({
      query: text,
    });
  } catch (err) {
    console.error(err);
    return;
  }
}

export async function findMatchingUser(richTextLink, options: PluginConfig) {
  const {userDirectory} = options;
  if (!richTextLink) {
    throw new Error('🚨 Please pass a mention object');
  }
  const notionUsers = await getWorkspaceUsers();
  const mentionName = richTextLink?.content;
  const mentionLink = richTextLink?.link.url;

  if (userDirectory && userDirectory.length > 0) {
    const userIdRegex = /\w+$/gm;
    let profileId;
    const fromUserDirectory = userDirectory.find(({profile}) => {
      profileId = mentionLink.match(userIdRegex)[0];

      return profile.includes(profileId);
    });
    if (!fromUserDirectory) {
      return false;
    }

    console.log('DIRECTORY MATCH:', profileId, fromUserDirectory);

    const foundUser = notionUsers?.find(({name}) => {
      if (!name) {
        console.warn('Notion Users.name was undefined');
        return false;
      }
      return fromUserDirectory.name.toUpperCase().includes(name.toUpperCase());
    });
    return foundUser as PersonUser;
  }

  const foundUser = notionUsers?.find(
    ({name}) => name?.toUpperCase() === mentionName.toUpperCase() // case-insensitive
  );
  return foundUser as PersonUser;
}

export async function findMatchingPage(link, options: PluginConfig) {
  const {files} = options;

  if (!link) {
    throw new Error('🚨 Please pass a rich text link object');
  }
  const mentionName = link.content;
  const mentionLink = link.link.url;
  const searchQuery = await queryWorkspace(mentionName);
  console.log('QUERY RESULTS:', searchQuery);
  console.log('FILES:', files);

  if (searchQuery && searchQuery.results.length > 1) {
    console.warn(
      '⚠️ The search query returned more than result, the first one will be used.',
      `May need to check for duplicates: ${JSON.stringify(searchQuery)}`
    );
  }

  if (files && searchQuery?.results.length === 0) {
    console.log(`Searching folder for matching file: ${mentionName}`);
    // search [files] for a page not found in the notion workspace
    const foundInFolder = files.find(({filepath}) => {
      // https://nodejs.org/docs/latest-v16.x/api/path.html#pathbasenamepath-ext
      const filename = path.basename(filepath, '.md');
      const hasFileMatch = filename === mentionName;
      return hasFileMatch;
    });

    if (!foundInFolder) {
      return false;
    }

    console.log(
      'FILE MATCH FOUND:',
      `Mentioned "${mentionName}", matching from ${foundInFolder.filepath}`
    );
    return {filepath: foundInFolder.filepath};
  }

  if (searchQuery && searchQuery.results.length > 0) {
    const firstQueryMatch = searchQuery?.results[0];
    return {page: firstQueryMatch};
  }

  console.warn('⚠️ No conditions have been matched.');
  return false;
}
