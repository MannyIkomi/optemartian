import * as notion from './notion';
import { Block, RichText } from './notion';
import { Directory } from './readCsv';
export interface File {
    filepath: string;
}
export interface LinkMatcher {
    user?: string;
    post?: string;
}
export interface PluginConfig {
    linkMatcher: LinkMatcher;
    files?: File[];
    csvDirectory?: string;
    userDirectory?: Directory[];
    csvOptions?: Object;
    onMatchedPage?: (data: Object) => any | void;
}
export declare function withPageMentions(notionBlocks: Block[] | Promise<Block[]>, config: PluginConfig): Promise<Promise<notion.Block>[]>;
export declare function withUserMentions(notionBlocks: Block[] | Promise<Block[]>, config: PluginConfig): Promise<Promise<notion.Block>[]>;
export declare function swapPageMentions(richTextAst: RichText[] | Promise<RichText[]>, config: PluginConfig): Promise<notion.RichText[] | Promise<notion.RichText>[]>;
export declare function swapUserMentions(richTextAst: RichText[] | Promise<RichText[]>, config: PluginConfig): Promise<notion.RichText[] | Promise<notion.RichText>[]>;
