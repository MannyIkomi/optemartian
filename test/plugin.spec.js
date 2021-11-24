import {withUserMentions} from '../src/plugin.js';
import {markdownToRichText} from '../src/index';

describe('with User Mentions Plugin', () => {
  it('dsfnbhdgjkas', async () => {
    const text =
      'User mention [Val](https://slab.discord.tools/users/8c5e38a7)';

    const received = withUserMentions(markdownToRichText(text));
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
        text: {content: 'User mention ', link: undefined},
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
            name: 'Val',
            object: 'user',
          },
        },
        type: 'mention',
      },
    ];

    return expect(received).resolves.toStrictEqual(expected);
  });
});
