import * as notion from './notion';
export declare function withPageMentions(notionBlocks: never[] | undefined, config: any): Promise<any[]>;
export declare function withUserMentions(notionBlocks?: never[], csvDirectory?: string): Promise<any[]>;
export declare function swapPageMentions(richTextAst: never[] | undefined, config: any): Promise<notion.RichText[] | undefined>;
export declare function swapUserMentions(richTextAst?: never[], csvDirectory?: string): Promise<notion.RichText[] | undefined>;
