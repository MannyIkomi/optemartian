import type { Annotations, RichText, DateMention, DatabaseMention, PageMention, UserMention } from '@notionhq/client/build/src/api-types';
export interface RichTextOptions {
    type?: 'text' | 'mention' | 'equation' | string;
    annotations?: Partial<Annotations>;
    url?: string;
}
export declare function richText(content: string, options?: RichTextOptions): RichText;
export declare function richTextMention(mention: UserMention | DateMention | PageMention | DatabaseMention, options?: RichTextOptions): RichText;
