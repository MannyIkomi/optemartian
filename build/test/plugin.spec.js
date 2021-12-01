// @ts-nocheck
import { markdownToRichText, markdownToBlocks } from '../src/index';
import { withUserMentions, swapUserMentions } from '../src/plugin';
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
/*
describe('CSV parsing', () => {
  it('returns rows of data', async () => {
    const received = await readCsv('discordteam.csv', {
      csvOptions: {
        delimiter: ';',
        ignoreEmpty: true,
        headers: true,
        objectMode: true,
      },
      rowTransformer: row => ({
        email: row.email,
        name: row.text,
        profile: row.profile_url,
      }),
    });
    console.log(received);

    const expected = {
      email: 'valentine.erokhin@discordapp.com',
      name: 'Valentine Erokhin',
      profile: '/users/valentine-erokhin-0groiz7t',
    };

    expect(received).toThrow();
    // toEqual(expect.arrayContaining(expected));
  }, 10000);
}); */
//# sourceMappingURL=plugin.spec.js.map