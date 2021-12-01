import * as csv from 'fast-csv';
export function readCsv(filepath = '', config) {
    const { csvOptions, rowTransformer } = config;
    if (!filepath) {
        throw new Error(`filePath is required`);
    }
    return new Promise((resolve, reject) => {
        const collectedRows = [];
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
    });
}
//# sourceMappingURL=readCsv.js.map