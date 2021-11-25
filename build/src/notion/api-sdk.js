"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingUser = exports.getWorkspaceUsers = exports.notionClient = void 0;
// @ts-nocheck
const client_1 = require("@notionhq/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VAL_NOTION_API_KEY = process.env.VAL_NOTION_API_KEY;
exports.notionClient = new client_1.Client({ auth: VAL_NOTION_API_KEY });
async function getWorkspaceUsers() {
    // https://developers.notion.com/reference/get-users
    try {
        const { results } = await exports.notionClient.users.list();
        return results;
    }
    catch (error) {
        console.error(error);
    }
}
exports.getWorkspaceUsers = getWorkspaceUsers;
async function findMatchingUser(mention = {}, userDirectory = []) {
    if (!mention) {
        throw new Error('🚨 Please pass a mention object');
    }
    const notionUsers = await getWorkspaceUsers();
    const mentionName = mention.content;
    const mentionLink = mention.link.url;
    if (userDirectory && userDirectory.length > 0) {
        const userIdRegex = /\w+$/gm;
        const fromUserDirectory = userDirectory.find(({ name = '', profile = '' }) => {
            const profileId = mentionLink.match(userIdRegex)[0];
            // console.log('PROFILE ID:', profileId);
            return profileId
                ? profile.includes(profileId)
                : name.includes(mentionName);
        });
        console.log('DIRECTORY MATCH:', fromUserDirectory);
        const foundUser = notionUsers.find(({ name }) => fromUserDirectory
            ? fromUserDirectory.name.toUpperCase().includes(name.toUpperCase())
            : name.toUpperCase() === mentionName.toUpperCase() // case-insensitiv
        );
        return foundUser;
    }
    const foundUser = notionUsers.find(({ name }) => name.toUpperCase() === mentionName.toUpperCase() // case-insensitive
    );
    return foundUser;
}
exports.findMatchingUser = findMatchingUser;
//# sourceMappingURL=api-sdk.js.map