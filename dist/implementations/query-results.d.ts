import { OkPacket } from "mysql2";
export declare class QueryResult {
    answer: OkPacket;
    updatedRows: number;
    constructor(data: OkPacket);
    /**
     * True if the number of updated rows is higher than 0
     */
    get hasChanged(): boolean;
    /**
     * Convert the results of this query into a JSON string
     */
    toJSON(): Object;
}
