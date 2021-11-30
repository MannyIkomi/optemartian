// @ts-nocheck
import * as csv from 'fast-csv';

// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

export function readCsv(filePath = '', config = {}) {
  const {csvOptions, rowTransformer} = config;
  if (!filePath) {
    throw new Error(`filePath is required`);
  }

  return new Promise((resolve, reject) => {
    const collectedRows = [];
    csv
      .parseFile(filePath, csvOptions)
      .on('error', reject)
      .on('data', row => {
        const transformedRow = rowTransformer(row);
        transformedRow && collectedRows.push(transformedRow);
      })
      .on('end', rowCount => {
        resolve(collectedRows);
        console.log(`Parsed ${rowCount} rows`);
      });
  });
}
