// @ts-nocheck
import {Client} from '@notionhq/client';
import dotenv from 'dotenv';
import {PersonUser} from '.';
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

    const fromUserDirectory = userDirectory.find(
      ({name = '', profile = ''}) => {
        const profileId = mentionLink.match(userIdRegex)[0];
        console.log('PROFILE ID:', profileId);

        return profile.includes(profileId);
      }
    );
    console.log('DIRECTORY MATCH:', fromUserDirectory);

    const foundUser = notionUsers.find(
      ({name}) =>
        fromUserDirectory
          ? fromUserDirectory.name.toUpperCase().includes(name.toUpperCase())
          : name.toUpperCase() === mentionName.toUpperCase() // case-insensitiv
    );
    return foundUser as PersonUser;
  }

  const foundUser = notionUsers.find(
    ({name}) => name.toUpperCase() === mentionName.toUpperCase() // case-insensitive
  );
  return foundUser as PersonUser;
}
