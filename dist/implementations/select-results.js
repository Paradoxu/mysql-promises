"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectResult = void 0;
const no_elements_1 = require("../errors/no-elements");
class SelectResult {
    constructor(data) {
        this.results = [];
        this.originalAnswer = data;
        this.setResults(data);
    }
    setResults(data) {
        this.results = data.map(d => ({ ...d }));
    }
    /**
     * Get the first result returned from this query
     * it will return undefined if the results array is empty
     */
    get first() {
        return this.results[0];
    }
    /**
     * Internally call the first getter, and check if the value is different from undefined
     * it will throw an Error in case of undefined
     */
    get firstAssert() {
        let r = this.first;
        if (!r)
            throw new Error('No elements found');
        return r;
    }
    /**
     * Return true if there is some data returned from this query
     */
    get hasResults() {
        return this.results.length > 0;
    }
    /**
     * Assert that this result has results by calling the getter hasResults
     *
     * @throws EmptyResult error if there's no result on this instance
     */
    assert() {
        if (!this.hasResults)
            throw new no_elements_1.EmptyResult('No elements found on the result');
    }
    /**
     * Convert the results of this query into a JSON string
     */
    toJSON() {
        return this.results;
    }
}
exports.SelectResult = SelectResult;
