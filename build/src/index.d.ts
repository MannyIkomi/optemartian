import type * as notion from './notion';
export declare function markdownToBlocks(body: string): notion.Block[];
/**
 * Parses inline Markdown content into Notion RichText objects.
 * Only supports plain text, italics, bold, strikethrough, inline code, and hyperlinks.
 *
 * @param text any inline Markdown or GFM content
 */
export declare function markdownToRichText(text: string): notion.RichText[];
