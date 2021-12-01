import * as notion from './notion';
import { readCsv } from './readCsv';
export async function withPageMentions(notionBlocks, config) {
    // {linkSubstring, files, onMissingPage} = options
    return Promise.all(notionBlocks.map(async (block) => {
        if (block.paragraph && block.type === 'paragraph') {
            const richText = block.paragraph.text;
            // console.log(richText);
            return {
                ...block,
                paragraph: { text: await swapPageMentions(richText, config) },
            };
        }
        return block;
    }));
}
export async function withUserMentions(notionBlocks, config) {
    return Promise.all(notionBlocks.map(async (block) => {
        if (block.type === 'paragraph' && block.paragraph) {
            const richText = block.paragraph.text;
            // console.log(richText);
            return {
                ...block,
                paragraph: { text: await swapUserMentions(richText, config) },
            };
        }
        return block;
    }));
}
export async function swapPageMentions(richTextAst, config) {
    const { linkSubstring, onMatchedPage } = config;
    try {
        return Promise.all(richTextAst.flatMap(async (ast) => {
            const hasLink = ast?.type === 'text' && ast?.text.link;
            if (hasLink && linkSubstring && hasLink.url.includes(linkSubstring)) {
                console.log(ast);
                const mention = ast.text;
                // Query for first matching page
                // if query is empty, check the {folderpath} for a matching title
                const matchedPage = await notion.findMatchingPage(mention, config);
                if (!matchedPage) {
                    // if no page found, return original ast early, with console warning
                    console.warn(`Could not find matching page for: ${JSON.stringify(mention)}}`);
                    return ast;
                }
                if (matchedPage.page) {
                    console.log('PAGE EXISTED IN NOTION:', matchedPage.page);
                    return notion.richTextMention({
                        type: 'page',
                        page: {
                            id: matchedPage.page.id,
                        },
                    });
                }
                if (matchedPage.filepath) {
                    // create the page using the markdownfile found
                    onMatchedPage && onMatchedPage({ matchedPage, ast, config });
                    return; //notion.richTextMention({})
                    // use returned created page to create the richTextMention inline
                    // if so create the page before the mention using {onMissingPage}
                }
            }
            return ast;
        }));
    }
    catch (err) {
        console.error(err);
        return;
    }
}
export async function swapUserMentions(richTextAst, config) {
    const { csvDirectory } = config;
    try {
        return Promise.all(richTextAst.flatMap(async (ast) => {
            const hasLink = ast.type === 'text' && ast.text.link;
            if (hasLink && hasLink.url.includes('slab.discord.tools/users')) {
                console.log(ast);
                const mention = ast.text;
                const userDirectory = await readCsv(csvDirectory, {
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
                const matchedUser = await notion.findMatchingUser(mention, {
                    userDirectory,
                });
                if (!matchedUser) {
                    console.warn(`Could not find matching user for ${JSON.stringify(mention)}`);
                    return ast;
                }
                console.log('MATCHED NOTION USER:', matchedUser);
                return notion.richTextMention({
                    type: 'user',
                    user: {
                        object: 'user',
                        // name: matchedUser.name,
                        id: matchedUser.id,
                    },
                });
            }
            return ast;
        }));
    }
    catch (err) {
        console.error(err);
        return;
    }
}
//# sourceMappingURL=plugin.js.map