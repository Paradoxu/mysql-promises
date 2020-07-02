import { OkPacket } from "mysql2";

export class DeleteResult<T extends Object>{
    public results: T[] = [];
    public originalAnswer: OkPacket;
    public updatedRows: number = 0;

    constructor(data: OkPacket) {
        this.originalAnswer = data;
        this.updatedRows = data.affectedRows;
    }

    /**
     * True if the number of updated rows is higher than 0
     */
    get hasUpdated(): boolean {
        return this.updatedRows > 0;
    }
}