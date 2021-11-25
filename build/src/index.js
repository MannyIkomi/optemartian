"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToRichText = exports.markdownToBlocks = void 0;
const unified_1 = __importDefault(require("unified"));
const remark_parse_1 = __importDefault(require("remark-parse"));
const internal_1 = require("./parser/internal");
const remark_gfm_1 = __importDefault(require("remark-gfm"));
// import * as notion from './notion';
/**
 * Parses Markdown content into Notion Blocks.
 * - Supports all heading types (heading depths 4, 5, 6 are treated as 3 for Notion)
 * - Supports numbered lists, bulleted lists, to-do lists
 * - Supports italics, bold, strikethrough, inline code, hyperlinks
 *
 * Per Notion limitations, these markdown attributes are not supported:
 * - Tables (removed)
 * - HTML tags (removed)
 * - Thematic breaks (removed)
 * [x] Code blocks (treated as paragraph)
 * - Block quotes (treated as paragraph)
 *
 * Supports GitHub-flavoured Markdown.
 *
 * @param body any Markdown or GFM content
 */
function markdownToBlocks(body) {
    const root = (0, unified_1.default)().use(remark_parse_1.default).use(remark_gfm_1.default).parse(body);
    return (0, internal_1.parseBlocks)(root);
}
exports.markdownToBlocks = markdownToBlocks;
/**
 * Parses inline Markdown content into Notion RichText objects.
 * Only supports plain text, italics, bold, strikethrough, inline code, and hyperlinks.
 *
 * @param text any inline Markdown or GFM content
 */
function markdownToRichText(text) {
    // intercept markdown strings here
    // check for string including a user mention
    const root = (0, unified_1.default)().use(remark_parse_1.default).use(remark_gfm_1.default).parse(text);
    /* const withUserMentions = tree =>
      map(tree, node => {
        if (node.type === 'link') {
          // @ts-ignore
          if (node.url.includes('slab.discord.tools/users/')) {
            console.log(node);
  
            // nodeReplacement.type = 'mention';
            // fetch where link name is a notion user name
  
            // @ts-ignores
            const linkDisplayText = node.children[0].value;
  
            return [
              notion.richTextMention({
                type: 'user',
                user: {
                  object: 'user',
                  name: linkDisplayText,
                  id: '',
                },
              }),
            ];
          }
        }
      }); */
    const richText = (0, internal_1.parseRichText)(root);
    return richText;
}
exports.markdownToRichText = markdownToRichText;
__exportStar(require("./plugin"), exports);
//# sourceMappingURL=index.js.map