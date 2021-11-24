import {markdownToBlocks, markdownToRichText} from '../src';
import * as notion from '../src/notion';

describe('markdown converter', () => {
  it('should convert markdown to blocks', () => {
    const text = `
hello _world_ 
*** 
## heading2
* [x] todo
`;
    const actual = markdownToBlocks(text);

    const expected = [
      notion.paragraph([
        notion.richText('hello '),
        notion.richText('world', {annotations: {italic: true}}),
      ]),
      notion.headingTwo([notion.richText('heading2')]),
      notion.toDo(true, [notion.richText('todo')]),
    ];

    expect(expected).toStrictEqual(actual);
  });

  it('should convert markdown to rich text', () => {
    const text = 'hello [_url_](https://example.com)';
    const actual = markdownToRichText(text);

    const expected = [
      notion.richText('hello '),
      notion.richText('url', {
        annotations: {italic: true},
        url: 'https://example.com',
      }),
    ];

    expect(expected).toStrictEqual(actual);
  });

  it('should convert links to RichText', () => {
    const text =
      'This will not be a mention: [Val](https://some.other.link.com/)';
    const actual = markdownToRichText(text);

    const expected = [
      notion.richText('This will not be a mention: '),
      notion.richText('Val', {
        url: 'https://some.other.link.com/',
      }),
    ];

    expect(expected).toStrictEqual(actual);
  });
});

describe('find matching user', () => {
  it('gets a notion user', async () => {
    const actual = await notion.findMatchingUser('Val');

    const expected = {
      type: 'person',
      name: 'Val',
    };

    expect(actual).toStrictEqual(expect.objectContaining(expected));
  });
});
