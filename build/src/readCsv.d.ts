export interface directory {
    profile: string;
    name: string;
}
export declare function readCsv(filePath: string | undefined, config: any): Promise<directory[]>;
