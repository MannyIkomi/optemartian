"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richTextMention = exports.richText = void 0;
function richText(content, options = {}) {
    var _a, _b;
    const annotations = (_a = options.annotations) !== null && _a !== void 0 ? _a : {};
    const type = (_b = options.type) !== null && _b !== void 0 ? _b : '';
    return {
        type: type,
        annotations: {
            bold: false,
            strikethrough: false,
            underline: false,
            italic: false,
            code: false,
            color: 'default',
            ...annotations,
        },
        text: {
            content: content,
            link: options.url
                ? {
                    type: 'url',
                    url: options.url,
                }
                : undefined,
        },
    };
}
exports.richText = richText;
function richTextMention(mention, options = {}) {
    var _a;
    const annotations = (_a = options.annotations) !== null && _a !== void 0 ? _a : {};
    const type = options.type || 'mention';
    // type: type,
    // mention: {
    //   type: 'user',
    //   user: {
    //     type: 'person',
    //     name: content,
    //   },
    // },
    return {
        type: 'mention',
        mention,
        annotations: {
            bold: false,
            strikethrough: false,
            underline: false,
            italic: false,
            code: false,
            color: 'default',
            ...annotations,
        },
    };
}
exports.richTextMention = richTextMention;
//# sourceMappingURL=common.js.map