import type {
  Annotations,
  RichText,
  DateMention,
  DatabaseMention,
  PageMention,
  UserMention,
} from '@notionhq/client/build/src/api-types';

export interface RichTextOptions {
  type?: 'text' | 'mention' | 'equation' | string;
  annotations?: Partial<Annotations>;
  url?: string;
}

export function richText(
  content: string,
  options: RichTextOptions = {}
): RichText {
  const annotations = options.annotations ?? {};
  const type = options.type ?? '';

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
  } as RichText;
}

export function richTextMention(
  mention: UserMention | DateMention | PageMention | DatabaseMention,
  options: RichTextOptions = {}
): RichText {
  const annotations = options.annotations ?? {};
  const type = options.type ?? 'mention';

  // type: type,
  // mention: {
  //   type: 'user',
  //   user: {
  //     type: 'person',
  //     name: content,
  //   },
  // },
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
  } as RichText;
}
