import * as notion from './notion/index.ts';

export async function withUserMentions(richTextAst = []) {
  try {
    return Promise.all(
      richTextAst.flatMap(async ast => {
        const hasLink = ast.type === 'text' && ast.text.link;
        if (hasLink && hasLink.url.includes('slab.discord.tools/users')) {
          console.log(ast);

          const mentionName = ast.text.content;
          // confirm mention name matches discordteam.csv
          return notion
            .findMatchingUser(mentionName)
            .then(matchedUser => {
              if (!matchedUser) {
                console.warn(`Could not find matching user for ${mentionName}`);
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
            })
            .catch(err => console.log('CATCH ERROR', err));
        }
        return ast;
      })
    );
  } catch (err) {
    console.error(err);
  }
}
