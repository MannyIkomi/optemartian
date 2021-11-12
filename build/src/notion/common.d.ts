import type { Annotations, RichText } from '@notionhq/client/build/src/api-types';
export interface RichTextOptions {
    type?: 'text' | 'mention' | 'equation' | string;
    annotations?: Partial<Annotations>;
    url?: string;
}
export declare function richText(content: string, options?: RichTextOptions): RichText;
