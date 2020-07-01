"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyResult = void 0;
class EmptyResult extends Error {
    constructor(message) {
        super(message);
    }
}
exports.EmptyResult = EmptyResult;
