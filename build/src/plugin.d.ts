import * as notion from './notion';
import { Block, RichText } from './notion';
import { directory } from './readCsv';
export interface file {
    filepath: string;
}
export interface pluginConfig {
    csvDirectory?: string;
    files?: file[];
    userDirectory?: directory[];
    linkSubstring?: string;
    onMatchedPage?: (data: Object) => any | void;
}
export declare function withPageMentions(notionBlocks: any, config: pluginConfig): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
export declare function withUserMentions(notionBlocks: Block[], config: pluginConfig): Promise<notion.Block[]>;
export declare function swapPageMentions(richTextAst: RichText[], config: pluginConfig): Promise<(notion.RichText | undefined)[] | undefined>;
export declare function swapUserMentions(richTextAst: RichText[], config: pluginConfig): Promise<notion.RichText[] | undefined>;
