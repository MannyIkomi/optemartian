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

export async function findMatchingUser(query) {
  const users = await getWorkspaceUsers();
  const foundUser = users.find(
    ({name}) => name.toUpperCase() === query.toUpperCase() // case-insensitive
  );
  return foundUser as PersonUser;
}
