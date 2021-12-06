export function code(text, lang) {
    // captions?
    return {
        object: 'block',
        type: 'code',
        code: {
            text,
            language: lang || 'plain text',
        },
    };
}
export function paragraph(text) {
    return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
            text,
        },
    };
}
export function headingOne(text) {
    return {
        object: 'block',
        type: 'heading_1',
        heading_1: {
            text,
        },
    };
}
export function headingTwo(text) {
    return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
            text,
        },
    };
}
export function headingThree(text) {
    return {
        object: 'block',
        type: 'heading_3',
        heading_3: {
            text,
        },
    };
}
export function bulletedListItem(text, children) {
    return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
            text,
            children,
        },
    };
}
export function numberedListItem(text, children) {
    return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
            text,
            children,
        },
    };
}
export function toDo(checked, text, children) {
    return {
        object: 'block',
        type: 'to_do',
        to_do: {
            text,
            checked: checked,
            children,
        },
    };
}
//# sourceMappingURL=blocks.js.map