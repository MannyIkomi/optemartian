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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv = __importStar(require("fast-csv"));
// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));
const Users = [];
let done = false;
fs.createReadStream(path.resolve(__dirname, '../discordteam.csv'))
    .pipe(csv.parse({ headers: true, delimiter: ';' }))
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
exports.default = Users;
//# sourceMappingURL=userList.js.map