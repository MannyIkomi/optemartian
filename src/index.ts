import unified from 'unified';
import {visit} from 'unist-util-visit';
import type * as uni from 'unified';
import markdown from 'remark-parse';
import * as notion from './notion';
import {parseBlocks, parseRichText} from './parser/internal';
import type * as md from './markdown';
import gfm from 'remark-gfm';
// import * as notion from './notion';

/**
 * Parses Markdown content into Notion Blocks.
 * - Supports all heading types (heading depths 4, 5, 6 are treated as 3 for Notion)
 * - Supports numbered lists, bulleted lists, to-do lists
 * - Supports italics, bold, strikethrough, inline code, hyperlinks
 *
 * Per Notion limitations, these markdown attributes are not supported:
 * - Tables (removed)
 * - HTML tags (removed)
 * - Thematic breaks (removed)
 * [x] Code blocks (treated as paragraph)
 * - Block quotes (treated as paragraph)
 *
 * Supports GitHub-flavoured Markdown.
 *
 * @param body any Markdown or GFM content
 */

function urlToMention(options = {}) {
  const substring = options;
  if (!substring) {
    throw new Error('Substring required for transformer');
  }

  return tree => {
    // visit(tree, 'type.paragraph', paragraph => {
    //   console.log('paragraph', paragraph);
    // });
    console.log('TREE', tree);
    console.log('Find substring', substring);
  };
}

export function markdownToBlocks(body: string): notion.Block[] {
  const root = unified().use(markdown).use(gfm).parse(body);

  return parseBlocks(root as unknown as md.Root);
}

/**
 * Parses inline Markdown content into Notion RichText objects.
 * Only supports plain text, italics, bold, strikethrough, inline code, and hyperlinks.
 *
 * @param text any inline Markdown or GFM content
 */
export function markdownToRichText(text: string): notion.RichText[] {
  // intercept markdown strings here
  // check for string including a user mention

  const root = unified()
    .use(urlToMention, {substring: 'slab.discord.tools/users/'})
    .use(markdown)
    .use(gfm)
    .parse(text);

  visit(root, node => {
    let nodeReplacement;
    if (node.type === 'link') {
      // @ts-ignore
      if (node.url.includes('slab.discord.tools/users/')) {
        console.log(node);

        nodeReplacement.type = 'mention';
        // fetch where link name is a notion user name

        // @ts-ignores
        const linkDisplayText = node.children[0].value;

        console.log([
          notion.richTextMention(
            {
              type: 'user',
              user: {
                object: 'user',
                name: linkDisplayText,
                id: '',
              },
            },
            nodeReplacement
          ),
        ]);
      }
    }
  });

  return parseRichText(root as unknown as md.Root);
}
