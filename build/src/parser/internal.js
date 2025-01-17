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
exports.parseRichText = exports.parseBlocks = void 0;
const notion = __importStar(require("../notion"));
function parseInline(element, options) {
    var _a, _b;
    const copy = {
        type: 'text',
        annotations: {
            ...((_a = options === null || options === void 0 ? void 0 : options.annotations) !== null && _a !== void 0 ? _a : {}),
        },
        url: options === null || options === void 0 ? void 0 : options.url,
    };
    switch (element.type) {
        case 'image':
            return [notion.richText((_b = element.title) !== null && _b !== void 0 ? _b : element.url, copy)];
        case 'text':
            return [notion.richText(element.value, copy)];
        case 'delete':
            copy.annotations.strikethrough = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'emphasis':
            copy.annotations.italic = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'strong':
            copy.annotations.bold = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'link':
            // element.url.includes()
            if (element.url.includes('slab.discord.tools/users/')) {
                copy.type = 'mention';
                // fetch where link name is a notion user name
                // @ts-ignores
                const linkDisplayText = element.children[0].value;
                return [
                    notion.richTextMention({
                        type: 'user',
                        user: {
                            object: 'user',
                            name: linkDisplayText,
                            id: '',
                        },
                    }, copy),
                ];
            }
            if (!element.url.includes('slab.discord.tools/users/')) {
                copy.url = element.url;
                return element.children.flatMap(child => parseInline(child, copy));
            }
            throw new Error('Something went wrong processing links');
        case 'inlineCode':
            copy.annotations.code = true;
            return [notion.richText(element.value, copy)];
        default:
            return [];
    }
}
function parseParagraph(element) {
    const text = element.children.flatMap(child => parseInline(child));
    return notion.paragraph(text);
}
function parseHeading(element) {
    const text = element.children.flatMap(child => parseInline(child));
    switch (element.depth) {
        case 1:
            return notion.headingOne(text);
        case 2:
            return notion.headingTwo(text);
        default:
            return notion.headingThree(text);
    }
}
function parseCode(element) {
    const text = [notion.richText(element.value)];
    return notion.code(text, element.lang);
}
function parseList(element) {
    return element.children.flatMap(item => {
        const paragraph = item.children[0];
        if (paragraph) {
            if (paragraph.type !== 'paragraph') {
                return [];
            }
            const text = paragraph.children.flatMap(child => parseInline(child));
            if (element.start !== null && element.start !== undefined) {
                return [notion.numberedListItem(text)];
            }
            else if (item.checked !== null && item.checked !== undefined) {
                return [notion.toDo(item.checked, text)];
            }
            else {
                return [notion.bulletedListItem(text)];
            }
        }
        else {
            return [];
        }
    });
}
function parseNode(node) {
    switch (node.type) {
        case 'heading':
            return [parseHeading(node)];
        case 'paragraph':
            return [parseParagraph(node)];
        case 'code':
            return [parseCode(node)];
        case 'blockquote':
            return node.children.flatMap(parseNode);
        case 'list':
            return parseList(node);
        default:
            return [];
    }
}
function parseBlocks(root) {
    return root.children.flatMap(parseNode);
}
exports.parseBlocks = parseBlocks;
function parseRichText(root) {
    if (root.children.length !== 1 || root.children[0].type !== 'paragraph') {
        throw new Error(`Unsupported markdown element: ${JSON.stringify(root)}`);
    }
    const paragraph = root.children[0];
    return paragraph.children.flatMap(child => parseInline(child));
}
exports.parseRichText = parseRichText;
//# sourceMappingURL=internal.js.map