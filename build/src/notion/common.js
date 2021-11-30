export function richText(content, options = {}) {
    const annotations = options.annotations ?? {};
    const type = options.type ?? 'text';
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
export function richTextMention(mention, options = {}) {
    const annotations = options.annotations ?? {};
    const type = options.type ?? 'mention';
    return {
        type: type,
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
//# sourceMappingURL=common.js.map