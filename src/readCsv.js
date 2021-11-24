import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

export function readCsv(filePath = '', config = {}) {
  const {csvOptions, rowTransformer} = config;
  if (!filePath) {
    throw new Error(`filePath is required`);
  }

  return new Promise((reject, resolve) => {
    const collectedRows = [];
    csv
      .parseFile(filePath, csvOptions)
      .on('error', reject)
      .on('data', row => {
        console.log(row);
        const transformedRow = rowTransformer(row);
        transformedRow && collectedRows.push(transformedRow);
      })
      .on('end', rowCount => {
        resolve(collectedRows);
        console.log(`Parsed ${rowCount} rows`);
      });
  });
}

/* '../discordteam.csv' */
/* row => {
    Users.push({
      name: row.text,
      email: row.email,
    });
  } */

// if (done === true) {
//   console.log('DONE', done);
//   console.log(Users);
// }
