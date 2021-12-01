// @ts-nocheck
import { markdownToRichText, markdownToBlocks } from '../src/index';
import { withUserMentions, swapUserMentions, withPageMentions, swapPageMentions, } from '../src/plugin';
describe('with User Mentions Plugin', () => {
    it('Converts matching links inside Block[] to user mentions', async () => {
        const text = 'User mention [Val](https://slab.discord.tools/users/0groiz7t)';
        const received = withUserMentions(markdownToBlocks(text));
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
        const received = swapUserMentions(markdownToRichText(text));
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
        linkSubstring: 'https://slab.discord.tools/posts',
        files: [
            {
                filepath: '/Users/Manny/Documents/Freelance Client Files/Optemization/optemartian/src/mock-text.md',
            },
            {
                filepath: '/Users/Manny/Documents/Freelance Client Files/Optemization/optemartian/src/TEST MATCH Discord 2020 Year In Review.md',
            },
        ],
        onMatchedPage: data => {
            console.log('MISSING PAGE DATA:', data);
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