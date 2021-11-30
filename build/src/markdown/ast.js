export function text(value) {
    return {
        type: 'text',
        value: value,
    };
}
export function emphasis(...children) {
    return {
        type: 'emphasis',
        children: children,
    };
}
export function strong(...children) {
    return {
        type: 'strong',
        children: children,
    };
}
export function inlineCode(value) {
    return {
        type: 'inlineCode',
        value: value,
    };
}
export function paragraph(...children) {
    return {
        type: 'paragraph',
        children: children,
    };
}
export function root(...children) {
    return {
        type: 'root',
        children: children,
    };
}
export function link(url, ...children) {
    return {
        type: 'link',
        children: children,
        url: url,
    };
}
export function thematicBreak() {
    return {
        type: 'thematicBreak',
    };
}
export function heading(depth, ...children) {
    return {
        type: 'heading',
        depth: depth,
        children: children,
    };
}
export function code(value, lang) {
    return {
        type: 'code',
        lang: lang,
        value: value,
    };
}
export function blockquote(...children) {
    return {
        type: 'blockquote',
        children: children,
    };
}
export function listItem(...children) {
    return {
        type: 'listitem',
        children: children,
    };
}
export function checkedListItem(checked, ...children) {
    return {
        type: 'listitem',
        checked: checked,
        children: children,
    };
}
export function unorderedList(...children) {
    return {
        type: 'list',
        children: children,
        ordered: false,
    };
}
export function orderedList(...children) {
    return {
        type: 'list',
        children: children,
        start: 0,
        ordered: true,
    };
}
export function strikethrough(...children) {
    return {
        type: 'delete',
        children: children,
    };
}
export function table(...children) {
    return {
        type: 'table',
        children: children,
    };
}
export function tableRow(...children) {
    return {
        type: 'tableRow',
        children: children,
    };
}
export function tableCell(...children) {
    return {
        type: 'tableCell',
        children: children,
    };
}
//# sourceMappingURL=ast.js.map