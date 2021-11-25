import * as notion from './notion/index.ts';
import {readCsv} from './readCsv.js';

export async function withUserMentions(richTextAst = []) {
  try {
    return Promise.all(
      richTextAst.flatMap(async ast => {
        const hasLink = ast.type === 'text' && ast.text.link;
        if (hasLink && hasLink.url.includes('slab.discord.tools/users')) {
          console.log(ast);

          const mention = ast.text;
          const userDirectory = await readCsv('discordteam.csv', {
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

          const matchedUser = await notion.findMatchingUser(
            mention,
            userDirectory
          );

          console.log('MATCHED NOTION USER:', matchedUser);

          if (!matchedUser) {
            console.warn(
              `Could not find matching user for ${JSON.stringify(mention)} at ${
                hasLink.url
              }`
            );
            return ast;
          }

          return notion.richTextMention({
            type: 'user',
            user: {
              object: 'user',
              name: matchedUser.name,
              id: matchedUser.id,
            },
          });
        }
        return ast;
      })
    );
  } catch (err) {
    console.error(err);
  }
}
