"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteResult = void 0;
class DeleteResult {
    constructor(data) {
        this.results = [];
        this.updatedRows = 0;
        this.originalAnswer = data;
        this.updatedRows = data.affectedRows;
    }
    /**
     * True if the number of updated rows is higher than 0
     */
    get hasUpdated() {
        return this.updatedRows > 0;
    }
}
exports.DeleteResult = DeleteResult;
