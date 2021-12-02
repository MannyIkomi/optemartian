export interface Directory {
    profile: string;
    name: string;
}
export declare function readCsv(filepath: string | undefined, config: any): Promise<Directory[]>;
