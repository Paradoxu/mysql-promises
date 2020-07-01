"use strict";
// import { RowDataPacket, OkPacket } from "mysql2";
// export class QueryResult<T extends Object>{
//     public results: T[] = [];
//     private originalAnswer: RowDataPacket[] | OkPacket;
//     public affectedRows: number | undefined;
//     public changedRows: number | undefined;
//     public insertId: number | undefined;
//     public serverStatus: number | undefined;
//     public warningCount: number | undefined;
//     public message: string | undefined;
//     public procotol41: boolean | undefined;
//     constructor(data: RowDataPacket[] | OkPacket) {
//         this.originalAnswer = data;
//         if (data.constructor.name === 'RowDataPacket') {
//             this.setQueryData(<RowDataPacket[]>data);
//         } else if (data.constructor.name === 'OkPacket') {
//             this.setPacketInformation(<OkPacket>data);
//         }
//     }
//     /**
//      * Set the information if the query result is an OkPacket
//      */
//     private setPacketInformation(data: OkPacket) {
//         this.affectedRows = data.affectedRows;
//         this.changedRows = data.changedRows;
//         this.insertId = data.insertId;
//         this.serverStatus = data.serverStatus;
//         this.warningCount = data.warningCount;
//         this.message = data.message;
//         this.procotol41 = data.procotol41;
//     }
//     /**
//      * Set the data in case of RowDataPacket
//      */
//     private setQueryData(data: RowDataPacket[]) {
//         this.results = data.map<T>(d => {
//             let v = { ...d };
//             console.log(v)
//             return v as T;
//         });
//     }
//     /**
//      * Return true if this query has applied any changes to the database
//      */
//     get hasChanged(): boolean {
//         return (this.affectedRows !== 0 && this.changedRows !== 0);
//     }
// }
