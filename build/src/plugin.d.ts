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
    csvOptions?: Object;
    linkSubstring?: string;
    onMatchedPage?: (data: Object) => any | void;
}
export declare function withPageMentions(notionBlocks: Block[], config: pluginConfig): Promise<notion.Block[]>;
export declare function withUserMentions(notionBlocks: Block[], config: pluginConfig): Promise<Promise<notion.Block>[]>;
export declare function swapPageMentions(richTextAst: RichText[], config: pluginConfig): Promise<any[] | undefined>;
export declare function swapUserMentions(richTextAst: RichText[], config: pluginConfig): Promise<Promise<notion.RichText>[] | undefined>;
