import * as notion from '../notion';
function parseInline(element, options) {
    const copy = {
        type: 'text',
        annotations: {
            ...(options?.annotations ?? {}),
        },
        url: options?.url,
    };
    switch (element.type) {
        case 'image':
            return [notion.richText(element.title ?? element.url, copy)];
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
            copy.url = element.url;
            return element.children.flatMap(child => parseInline(child, copy));
        // throw new Error('Something went wrong processing links');
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
export function parseBlocks(root) {
    return root.children.flatMap(parseNode);
}
export function parseRichText(root) {
    if (root.children.length !== 1 || root.children[0].type !== 'paragraph') {
        throw new Error(`Unsupported markdown element: ${JSON.stringify(root)}`);
    }
    const paragraph = root.children[0];
    return paragraph.children.flatMap(child => parseInline(child));
}
//# sourceMappingURL=internal.js.map