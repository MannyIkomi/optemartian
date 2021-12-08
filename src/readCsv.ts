import * as csv from 'fast-csv';
import type ParserOptionsArgs from 'fast-csv';
// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));
export interface Directory {
  profile: string;
  name: string;
  email: string;
}

export function readCsv(filepath = '', config: any) {
  const {csvOptions, rowTransformer} = config;
  if (!filepath) {
    throw new Error(`filePath is required`);
  }

  return new Promise((resolve, reject) => {
    const collectedRows: Array<Directory> = [];
    csv
      .parseFile(filepath, csvOptions)
      .on('error', reject)
      .on('data', row => {
        const transformedRow = csvOptions.rowTransformer(row);
        transformedRow && collectedRows.push(transformedRow);
      })
      .on('end', rowCount => {
        resolve(collectedRows);
        console.log(`Parsed ${rowCount} rows`);
      });
  }) as Promise<Directory[]>;
}
