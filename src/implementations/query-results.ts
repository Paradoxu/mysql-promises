import { OkPacket } from "mysql2";

export class QueryResult {
    public answer: OkPacket;
    public updatedRows: number = 0;

    constructor(data: OkPacket) {
        this.answer = data;
        this.updatedRows = data.affectedRows;
    }

    /**
     * True if the number of updated rows is higher than 0
     */
    get hasChanged(): boolean {
        return this.updatedRows > 0;
    }

    /**
     * Convert the results of this query into a JSON string
     */
    toJSON(): Object {
        return this.answer as any;
    }
}