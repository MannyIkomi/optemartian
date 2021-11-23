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
const src_1 = require("../src");
const notion = __importStar(require("../src/notion"));
describe('markdown converter', () => {
    it('should convert markdown to blocks', () => {
        const text = `
hello _world_ 
*** 
## heading2
* [x] todo
`;
        const actual = (0, src_1.markdownToBlocks)(text);
        const expected = [
            notion.paragraph([
                notion.richText('hello '),
                notion.richText('world', { annotations: { italic: true } }),
            ]),
            notion.headingTwo([notion.richText('heading2')]),
            notion.toDo(true, [notion.richText('todo')]),
        ];
        expect(expected).toStrictEqual(actual);
    });
    it('should convert markdown to rich text', () => {
        const text = 'hello [_url_](https://example.com)';
        const actual = (0, src_1.markdownToRichText)(text);
        const expected = [
            notion.richText('hello '),
            notion.richText('url', {
                annotations: { italic: true },
                url: 'https://example.com',
            }),
        ];
        expect(expected).toStrictEqual(actual);
    });
    it('should convert links to RichText', () => {
        const text = 'This will be a mention: [Val](https://some.other.link.com/)';
        const actual = (0, src_1.markdownToRichText)(text);
        const expected = [
            notion.richText('This will be a mention: '),
            notion.richText('Val', {
                url: 'https://some.other.link.com/',
            }),
        ];
        expect(expected).toStrictEqual(actual);
    });
    it('should recognize slab links and return user mention as RichText', () => {
        const text = '[Val](https://slab.discord.tools/users/8c5e38a7)';
        const actual = (0, src_1.markdownToRichText)(text);
        const expected = [
            notion.richTextMention({
                type: 'user',
                user: {
                    object: 'user',
                    name: 'Val',
                    id: '',
                },
            }),
        ];
        expect(expected).toStrictEqual(actual);
    });
});
describe('find matching user', () => {
    it('gets a notion user', async () => {
        const actual = await notion.findMatchingUser('Val');
        const expected = {
            type: 'person',
            name: 'Val',
        };
        return expect(actual).toStrictEqual(expect.objectContaining(expected));
    });
});
describe('Markdown User Mention Plugin', () => {
    it('dsfnbhdgjkas', () => {
        const text = 'User mention [Val](https://slab.discord.tools/users/8c5e38a7)';
        const expected = (0, src_1.markdownToRichText)(text);
        const actual = [
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                text: { content: 'User mention ', link: undefined },
                type: 'text',
            },
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                mention: { type: 'user', user: { id: '', name: 'Val', object: 'user' } },
                type: 'mention',
            },
        ];
        expect(actual).toStrictEqual(expected);
    });
});
//# sourceMappingURL=integration.spec.js.map