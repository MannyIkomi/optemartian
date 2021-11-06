import type { BulletedListItemBlock, HeadingOneBlock, HeadingThreeBlock, HeadingTwoBlock, NumberedListItemBlock, ParagraphBlock, RichText, BlockBase, ToDoBlock } from '../../@notionhq/client/build/src/api-types';
export interface CodeBlock extends BlockBase {
    type: 'code';
    code: {
        text: RichText[];
    };
    has_children: false;
    lang: string;
}
export declare function code(text: RichText[], lang?: string | undefined): CodeBlock;
export declare function paragraph(text: RichText[]): ParagraphBlock;
export declare function headingOne(text: RichText[]): HeadingOneBlock;
export declare function headingTwo(text: RichText[]): HeadingTwoBlock;
export declare function headingThree(text: RichText[]): HeadingThreeBlock;
export declare function bulletedListItem(text: RichText[]): BulletedListItemBlock;
export declare function numberedListItem(text: RichText[]): NumberedListItemBlock;
export declare function toDo(checked: boolean, text: RichText[]): ToDoBlock;
