"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResult = void 0;
class QueryResult {
    constructor(data) {
        this.updatedRows = 0;
        this.answer = data;
        this.updatedRows = data.affectedRows;
    }
    /**
     * True if the number of updated rows is higher than 0
     */
    get hasChanged() {
        return this.updatedRows > 0;
    }
    /**
     * Convert the results of this query into a JSON string
     */
    toJSON() {
        return this.answer;
    }
}
exports.QueryResult = QueryResult;
