import * as md from '../markdown';
import * as notion from '../notion';
import {findMatchingUser} from '../notion';

function parseInline(
  element: md.PhrasingContent,
  options?: notion.RichTextOptions
): notion.RichText[] {
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
      // element.url.includes()
      if (element.url.includes('slab.discord.tools/users/')) {
        copy.type = 'mention';
        // fetch where link name is a notion user name

        // @ts-ignores
        const linkDisplayText = element.children[0].value;

        return [
          notion.richTextMention(
            {
              type: 'user',
              user: {
                object: 'user',
                name: linkDisplayText,
                id: '',
              },
            },
            copy
          ),
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

function parseParagraph(element: md.Paragraph): notion.ParagraphBlock {
  const text = element.children.flatMap(child => parseInline(child));
  return notion.paragraph(text);
}

function parseHeading(
  element: md.Heading
): notion.HeadingOneBlock | notion.HeadingTwoBlock | notion.HeadingThreeBlock {
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

function parseCode(element: md.Code): notion.CodeBlock {
  const text = [notion.richText(element.value)];
  return notion.code(text, element.lang);
}

function parseList(
  element: md.List
): (
  | notion.BulletedListItemBlock
  | notion.NumberedListItemBlock
  | notion.ToDoBlock
)[] {
  return element.children.flatMap(item => {
    const paragraph = item.children[0];
    if (paragraph) {
      if (paragraph.type !== 'paragraph') {
        return [] as (
          | notion.BulletedListItemBlock
          | notion.NumberedListItemBlock
          | notion.ToDoBlock
        )[];
      }

      const text = paragraph.children.flatMap(child => parseInline(child));
      if (element.start !== null && element.start !== undefined) {
        return [notion.numberedListItem(text)];
      } else if (item.checked !== null && item.checked !== undefined) {
        return [notion.toDo(item.checked, text)];
      } else {
        return [notion.bulletedListItem(text)];
      }
    } else {
      return [];
    }
  });
}

function parseNode(node: md.FlowContent): notion.Block[] {
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

export function parseBlocks(root: md.Root): notion.Block[] {
  return root.children.flatMap(parseNode);
}

export function parseRichText(root: md.Root): notion.RichText[] {
  if (root.children.length !== 1 || root.children[0].type !== 'paragraph') {
    throw new Error(`Unsupported markdown element: ${JSON.stringify(root)}`);
  }

  const paragraph = root.children[0];
  return paragraph.children.flatMap(child => parseInline(child));
}
