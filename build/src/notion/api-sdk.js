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
async function findMatchingUser(query) {
    const users = await getWorkspaceUsers();
    const foundUser = users.find(({ name }) => name.toUpperCase() === query.toUpperCase() // case-insensitive
    );
    return foundUser;
}
exports.findMatchingUser = findMatchingUser;
//# sourceMappingURL=api-sdk.js.map