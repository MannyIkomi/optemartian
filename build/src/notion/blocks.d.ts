import type { BulletedListItemBlock, HeadingOneBlock, HeadingThreeBlock, HeadingTwoBlock, NumberedListItemBlock, ParagraphBlock, RichText, CodeBlock, Block, ToDoBlock } from '@notionhq/client/build/src/api-types';
export declare function code(text: RichText[], lang?: string | undefined): CodeBlock;
export declare function paragraph(text: RichText[]): ParagraphBlock;
export declare function headingOne(text: RichText[]): HeadingOneBlock;
export declare function headingTwo(text: RichText[]): HeadingTwoBlock;
export declare function headingThree(text: RichText[]): HeadingThreeBlock;
export declare function bulletedListItem(text: RichText[], children?: Block[]): BulletedListItemBlock;
export declare function numberedListItem(text: RichText[], children?: Block[] | undefined): NumberedListItemBlock;
export declare function toDo(checked: boolean, text: RichText[], children?: Block[] | undefined): ToDoBlock;
