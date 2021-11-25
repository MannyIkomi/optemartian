"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUserMentions = void 0;
const notion = __importStar(require("./notion/index.ts"));
const readCsv_js_1 = require("./readCsv.js");
async function withUserMentions(richTextAst = []) {
    try {
        return Promise.all(richTextAst.flatMap(async (ast) => {
            const hasLink = ast.type === 'text' && ast.text.link;
            if (hasLink && hasLink.url.includes('slab.discord.tools/users')) {
                console.log(ast);
                const mention = ast.text;
                const userDirectory = await (0, readCsv_js_1.readCsv)('discordteam.csv', {
                    csvOptions: {
                        delimiter: ';',
                        ignoreEmpty: true,
                        headers: true,
                        objectMode: true,
                    },
                    rowTransformer: row => ({
                        email: row.email,
                        name: row.text,
                        profile: row.profile_url,
                    }),
                });
                const matchedUser = await notion.findMatchingUser(mention, userDirectory);
                console.log('MATCHED NOTION USER:', matchedUser);
                if (!matchedUser) {
                    console.warn(`Could not find matching user for ${JSON.stringify(mention)} at ${hasLink.url}`);
                    return ast;
                }
                return notion.richTextMention({
                    type: 'user',
                    user: {
                        object: 'user',
                        name: matchedUser.name,
                        id: matchedUser.id,
                    },
                });
            }
            return ast;
        }));
    }
    catch (err) {
        console.error(err);
    }
}
exports.withUserMentions = withUserMentions;
//# sourceMappingURL=plugin.js.map