import * as notion from './notion';
import { Block, RichText } from './notion';
import { Directory } from './readCsv';
export interface file {
    filepath: string;
}
export interface LinkMatcher {
    post?: string;
    user?: string;
}
export interface pluginConfig {
    csvDirectory?: string;
    files?: file[];
    linkMatcher: LinkMatcher;
    userDirectory?: Directory[];
    csvOptions?: Object;
    onMatchedPage?: (data: Object) => any | void;
}
export declare function withPageMentions(notionBlocks: Block[], config: pluginConfig): Promise<Promise<notion.Block>[]>;
export declare function withUserMentions(notionBlocks: Block[], config: pluginConfig): Promise<Promise<notion.Block>[]>;
export declare function swapPageMentions(richTextAst: RichText[] | Promise<RichText>[] | Promise<RichText[]>, config: pluginConfig): Promise<Promise<notion.Block>[] | undefined>;
export declare function swapUserMentions(richTextAst: RichText[] | Promise<RichText>[] | Promise<RichText[]>, config: pluginConfig): Promise<Promise<notion.RichText>[] | undefined>;
