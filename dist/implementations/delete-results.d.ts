import { OkPacket } from "mysql2";
export declare class DeleteResult<T extends Object> {
    results: T[];
    originalAnswer: OkPacket;
    updatedRows: number;
    constructor(data: OkPacket);
    /**
     * True if the number of updated rows is higher than 0
     */
    get hasUpdated(): boolean;
}
