import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

const Users = [];
let done = false;

fs.createReadStream(path.resolve(__dirname, '../discordteam.csv'))
  .pipe(csv.parse({headers: true, delimiter: ';'}))
  .on('error', error => console.error(error))
  .on('data', row => {
    done = false;
    Users.push({
      name: row.text,
      email: row.email,
    });
  })
  .on('end', rowCount => {
    done = true;
    console.log(`Parsed ${rowCount} rows`);
  });

// if (done === true) {
//   console.log('DONE', done);
//   console.log(Users);
// }

export default Users;
