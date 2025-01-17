"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDo = exports.numberedListItem = exports.bulletedListItem = exports.headingThree = exports.headingTwo = exports.headingOne = exports.paragraph = exports.code = void 0;
function code(text, lang) {
    // captions?
    return {
        object: 'block',
        type: 'code',
        code: {
            text,
            language: lang,
        },
    };
}
exports.code = code;
function paragraph(text) {
    return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
            text,
        },
    };
}
exports.paragraph = paragraph;
function headingOne(text) {
    return {
        object: 'block',
        type: 'heading_1',
        heading_1: {
            text,
        },
    };
}
exports.headingOne = headingOne;
function headingTwo(text) {
    return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
            text,
        },
    };
}
exports.headingTwo = headingTwo;
function headingThree(text) {
    return {
        object: 'block',
        type: 'heading_3',
        heading_3: {
            text,
        },
    };
}
exports.headingThree = headingThree;
function bulletedListItem(text) {
    return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
            text,
        },
    };
}
exports.bulletedListItem = bulletedListItem;
function numberedListItem(text) {
    return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
            text,
        },
    };
}
exports.numberedListItem = numberedListItem;
function toDo(checked, text) {
    return {
        object: 'block',
        type: 'to_do',
        to_do: {
            text,
            checked: checked,
        },
    };
}
exports.toDo = toDo;
//# sourceMappingURL=blocks.js.map