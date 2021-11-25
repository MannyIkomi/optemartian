"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCsv = void 0;
const csv = __importStar(require("fast-csv"));
// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));
function readCsv(filePath = '', config = {}) {
    const { csvOptions, rowTransformer } = config;
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
exports.readCsv = readCsv;
//# sourceMappingURL=readCsv.js.map