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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToRichText = exports.markdownToBlocks = void 0;
const unified_1 = __importDefault(require("unified"));
const unist_util_visit_1 = require("unist-util-visit");
const remark_parse_1 = __importDefault(require("remark-parse"));
const notion = __importStar(require("./notion"));
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
function urlToMention(options = {}) {
    const substring = options;
    if (!substring) {
        throw new Error('Substring required for transformer');
    }
    return tree => {
        // visit(tree, 'type.paragraph', paragraph => {
        //   console.log('paragraph', paragraph);
        // });
        console.log('TREE', tree);
        console.log('Find substring', substring);
    };
}
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
    const root = (0, unified_1.default)()
        .use(urlToMention, { substring: 'slab.discord.tools/users/' })
        .use(remark_parse_1.default)
        .use(remark_gfm_1.default)
        .parse(text);
    (0, unist_util_visit_1.visit)(root, node => {
        let nodeReplacement;
        if (node.type === 'link') {
            // @ts-ignore
            if (node.url.includes('slab.discord.tools/users/')) {
                console.log(node);
                nodeReplacement.type = 'mention';
                // fetch where link name is a notion user name
                // @ts-ignores
                const linkDisplayText = node.children[0].value;
                console.log([
                    notion.richTextMention({
                        type: 'user',
                        user: {
                            object: 'user',
                            name: linkDisplayText,
                            id: '',
                        },
                    }, nodeReplacement),
                ]);
            }
        }
    });
    return (0, internal_1.parseRichText)(root);
}
exports.markdownToRichText = markdownToRichText;
//# sourceMappingURL=index.js.map