// @ts-nocheck
import { markdownToRichText, markdownToBlocks } from '../src/index';
import { richTextMention } from '../src/notion';
import { withUserMentions, swapUserMentions, withPageMentions, swapPageMentions, } from '../src/plugin';
describe('with User Mentions Plugin', () => {
    const userMentionOptions = {
        linkMatcher: {
            users: 'slab.discord.tools/users',
        },
        csvDirectory: 'discordteam.csv',
        csvOptions: {
            delimiter: ';',
            ignoreEmpty: true,
            headers: true,
            objectMode: true,
            rowTransformer: row => ({
                email: row.email,
                name: row.text,
                profile: row.profile_url,
            }),
        },
    };
    it('Converts matching links inside Block[] to user mentions', async () => {
        const text = 'User mention [Val](https://slab.discord.tools/users/0groiz7t)';
        const received = withUserMentions(markdownToBlocks(text), userMentionOptions);
        const expected = [
            {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    text: [
                        {
                            annotations: {
                                bold: false,
                                code: false,
                                color: 'default',
                                italic: false,
                                strikethrough: false,
                                underline: false,
                            },
                            text: { content: 'User mention ', link: undefined },
                            type: 'text',
                        },
                        {
                            annotations: {
                                bold: false,
                                code: false,
                                color: 'default',
                                italic: false,
                                strikethrough: false,
                                underline: false,
                            },
                            mention: {
                                type: 'user',
                                user: {
                                    id: 'e7e5a229-8349-46bb-a1e2-bb9d69469172',
                                    object: 'user',
                                },
                            },
                            type: 'mention',
                        },
                    ],
                },
            },
        ];
        return expect(received).resolves.toStrictEqual(expected);
    });
    it('Converts matching links inside RichText[] to user mentions', async () => {
        const text = 'User mention [Val](https://slab.discord.tools/users/0groiz7t)';
        const received = swapUserMentions(markdownToRichText(text), userMentionOptions);
        const expected = [
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                text: { content: 'User mention ', link: undefined },
                type: 'text',
            },
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                mention: {
                    type: 'user',
                    user: {
                        id: 'e7e5a229-8349-46bb-a1e2-bb9d69469172',
                        object: 'user',
                    },
                },
                type: 'mention',
            },
        ];
        return expect(received).resolves.toStrictEqual(expected);
    });
});
describe('with Page Mentions Plugin', () => {
    // setup
    const pageMentionOptions = {
        linkMatcher: {
            posts: 'slab.discord.tools/posts',
        },
        csvDirectory: 'discordteam.csv',
        csvOptions: {
            delimiter: ';',
            ignoreEmpty: true,
            headers: true,
            objectMode: true,
            rowTransformer: row => ({
                email: row.email,
                name: row.text,
                profile: row.profile_url,
            }),
        },
        files: [
            {
                filepath: '/Users/Manny/Documents/Freelance Client Files/Optemization/optemartian/src/mock-text.md',
            },
            {
                filepath: '/Users/Manny/Documents/Freelance Client Files/Optemization/optemartian/src/TEST MATCH Discord 2020 Year In Review.md',
            },
        ],
        onMatchedPage: () => {
            // generate page from markdown file
            // use response to dynamically generate page mention
            return richTextMention({
                type: 'page',
                page: {
                    id: 'db3f4823-4fca-457d-bc2e-8aec396c28fa',
                    object: 'page',
                },
            });
        },
    };
    it('Converts matching links inside Block[] to page mentions', async () => {
        const text = 'Page mention [TEST MATCH Discord 2020 Year In Review](https://slab.discord.tools/posts/c8r8u5i4)';
        const received = withPageMentions(markdownToBlocks(text), pageMentionOptions);
        const expected = [
            {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    text: [
                        {
                            annotations: {
                                bold: false,
                                code: false,
                                color: 'default',
                                italic: false,
                                strikethrough: false,
                                underline: false,
                            },
                            text: { content: 'Page mention ', link: undefined },
                            type: 'text',
                        },
                        {
                            annotations: {
                                bold: false,
                                code: false,
                                color: 'default',
                                italic: false,
                                strikethrough: false,
                                underline: false,
                            },
                            mention: {
                                type: 'page',
                                page: {
                                    id: 'db3f4823-4fca-457d-bc2e-8aec396c28fa',
                                    object: 'page',
                                },
                            },
                            type: 'mention',
                        },
                    ],
                },
            },
        ];
        return expect(received).resolves.toStrictEqual(expected);
    });
    it('Converts matching links inside RichText[] to page mentions', async () => {
        const text = 'Page mention [TEST MATCH Discord 2020 Year In Review](https://slab.discord.tools/posts/c8r8u5i4)';
        const received = swapPageMentions(markdownToRichText(text), pageMentionOptions);
        const expected = [
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                text: { content: 'Page mention ', link: undefined },
                type: 'text',
            },
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                mention: {
                    type: 'page',
                    page: {
                        id: 'db3f4823-4fca-457d-bc2e-8aec396c28fa',
                        object: 'page',
                    },
                },
                type: 'mention',
            },
        ];
        return expect(received).resolves.toStrictEqual(expected);
    });
    it('Returns the original markdown if a matching page is not found', async () => {
        const text = 'Page mention link [This page does not exist](https://slab.discord.tools/posts/c8r8u5i4)';
        const received = swapPageMentions(markdownToRichText(text), pageMentionOptions);
        const expected = [
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                text: { content: 'Page mention link ', link: undefined },
                type: 'text',
            },
            {
                annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                },
                text: {
                    content: 'This page does not exist',
                    link: {
                        type: 'url',
                        url: 'https://slab.discord.tools/posts/c8r8u5i4',
                    },
                },
                type: 'text',
            },
        ];
        return expect(received).resolves.toStrictEqual(expected);
    });
});
//# sourceMappingURL=plugin.spec.js.map