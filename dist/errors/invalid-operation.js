"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOperation = void 0;
class InvalidOperation extends Error {
    constructor(message, query) {
        super(message);
        this.query = query;
    }
}
exports.InvalidOperation = InvalidOperation;
