import * as notion from './notion';
export declare function withUserMentions(notionBlocks?: never[], csvDirectory?: string): Promise<any[]>;
export declare function swapUserMentions(richTextAst?: never[], csvDirectory?: string): Promise<notion.RichText[] | undefined>;
