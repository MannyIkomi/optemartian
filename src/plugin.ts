import * as notion from './notion';
import {Block, RichText} from './notion';
import {Directory, readCsv} from './readCsv';

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

export async function withPageMentions(
  notionBlocks: Block[] | Promise<Block[]>,
  config: PluginConfig
) {
  const resolvedBlocks = await notionBlocks;
  return Promise.all(
    resolvedBlocks.flatMap(async block => {
      if (block.type === 'paragraph' && block.paragraph) {
        const {paragraph} = block;
        const richText = block.paragraph.text;
        // console.log(richText);
        return Object.assign(block, {
          paragraph: {
            ...paragraph,
            text: await swapPageMentions(richText, config),
          },
        }) as Block;
      }
      return block as Block;
    })
  ) as Promise<Block[]>;
}

export async function withUserMentions(
  notionBlocks: Block[] | Promise<Block[]>,
  config: PluginConfig
) {
  const resolvedBlocks = await notionBlocks;
  return Promise.all(
    resolvedBlocks.flatMap(async block => {
      if (block.type === 'paragraph' && block.paragraph) {
        const {paragraph} = block;
        const richText = block.paragraph.text;
        // console.log(richText);
        return Object.assign(block, {
          paragraph: {
            ...paragraph,
            text: await swapUserMentions(richText, config),
          },
        }) as Block;
      }
      return block as Block;
    })
  ) as Promise<Block[]>;
}

export async function swapPageMentions(
  richTextAst: RichText[] | Promise<RichText[]>,
  config: PluginConfig
) {
  const {linkMatcher, onMatchedPage} = config;
  try {
    const resolvedRichText = await richTextAst;
    return Promise.all(
      resolvedRichText.map(async ast => {
        const hasLink = ast?.type === 'text' && ast?.text.link;
        if (
          hasLink &&
          linkMatcher &&
          //@ts-ignore
          hasLink.url.includes(linkMatcher.post)
        ) {
          const mention = ast.text;

          // Query for first matching page
          // if query is empty, check the {folderpath} for a matching title
          const matchedPage = await notion.findMatchingPage(mention, config);

          if (!matchedPage) {
            // if no page found, return original ast early, with console warning
            console.warn(
              `Could not find matching page for: ${JSON.stringify(mention)}}`
            );
            return ast as RichText;
          }

          if (matchedPage.page) {
            console.log('PAGE EXISTED IN NOTION:', matchedPage.page);
            return notion.richTextMention({
              type: 'page',
              page: {
                id: matchedPage.page.id,
              },
            }) as RichText;
          }

          if (matchedPage.filepath) {
            // create the page using the markdownfile found
            return onMatchedPage && onMatchedPage({matchedPage, ast, config});

            //notion.richTextMention({})
            // use returned created page to create the richTextMention inline
            // if so create the page before the mention using {onMissingPage}
          }
        }

        return ast as RichText;
      })
    ) as Promise<RichText[]>;
  } catch (err) {
    console.error(err, richTextAst);
    return richTextAst as RichText[];
  }
}

export async function swapUserMentions(
  richTextAst: RichText[] | Promise<RichText[]>,
  config: PluginConfig
) {
  const {csvDirectory, linkMatcher} = config;

  try {
    const resolvedRichText = await richTextAst;
    return Promise.all(
      resolvedRichText.map(async ast => {
        const hasLink = ast.type === 'text' && ast.text.link;
        //@ts-ignore
        if (hasLink && hasLink.url.includes(linkMatcher.user)) {
          const mention = ast.text;
          const userDirectory = await readCsv(csvDirectory, config);

          const matchedUser = await notion.findMatchingUser(mention, {
            ...config,
            userDirectory,
          });

          if (!matchedUser) {
            console.warn(
              `Could not find matching user for ${JSON.stringify(mention)}`
            );
            return ast as RichText;
          }

          console.log('MATCHED NOTION USER:', matchedUser);

          return notion.richTextMention({
            type: 'user',
            user: {
              object: 'user',
              // name: matchedUser.name,
              id: matchedUser.id,
            },
          }) as RichText;
        }

        return ast as RichText;
      })
    ) as Promise<RichText[]>;
  } catch (err) {
    console.error(err, richTextAst);
    return richTextAst as RichText[];
  }
}
