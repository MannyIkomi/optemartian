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
async function withUserMentions(richTextAst = []) {
    try {
        return Promise.all(richTextAst.flatMap(async (ast) => {
            const hasLink = ast.type === 'text' && ast.text.link;
            if (hasLink && hasLink.url.includes('slab.discord.tools/users')) {
                console.log(ast);
                const mentionName = ast.text.content;
                // confirm mention name matches discordteam.csv
                return notion
                    .findMatchingUser(mentionName)
                    .then(matchedUser => {
                    if (!matchedUser) {
                        console.warn(`Could not find matching user for ${mentionName}`);
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
                })
                    .catch(err => console.log('CATCH ERROR', err));
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