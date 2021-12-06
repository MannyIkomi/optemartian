import type {
  BulletedListItemBlock,
  HeadingOneBlock,
  HeadingThreeBlock,
  HeadingTwoBlock,
  NumberedListItemBlock,
  ParagraphBlock,
  RichText,
  CodeBlock,
  Block,
  ToDoBlock,
} from '@notionhq/client/build/src/api-types';

export function code(text: RichText[], lang?: string | undefined): CodeBlock {
  // captions?
  return {
    object: 'block',
    type: 'code',
    code: {
      text,
      language: lang || 'plain text',
    },
  } as CodeBlock;
}

export function paragraph(text: RichText[]): ParagraphBlock {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      text,
    },
  } as ParagraphBlock;
}

export function headingOne(text: RichText[]): HeadingOneBlock {
  return {
    object: 'block',
    type: 'heading_1',
    heading_1: {
      text,
    },
  } as HeadingOneBlock;
}

export function headingTwo(text: RichText[]): HeadingTwoBlock {
  return {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      text,
    },
  } as HeadingTwoBlock;
}

export function headingThree(text: RichText[]): HeadingThreeBlock {
  return {
    object: 'block',
    type: 'heading_3',
    heading_3: {
      text,
    },
  } as HeadingThreeBlock;
}

export function bulletedListItem(
  text: RichText[],
  children?: Block[]
): BulletedListItemBlock {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      text,
      children,
    },
  } as BulletedListItemBlock;
}

export function numberedListItem(
  text: RichText[],
  children?: Block[] | undefined
): NumberedListItemBlock {
  return {
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      text,
      children,
    },
  } as NumberedListItemBlock;
}

export function toDo(
  checked: boolean,
  text: RichText[],
  children?: Block[] | undefined
): ToDoBlock {
  return {
    object: 'block',
    type: 'to_do',
    to_do: {
      text,
      checked: checked,
      children,
    },
  } as ToDoBlock;
}
