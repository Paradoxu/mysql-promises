import { RowDataPacket } from "mysql2";
export declare class SelectResult<T extends Object> {
    results: T[];
    originalAnswer: RowDataPacket[];
    constructor(data: RowDataPacket[]);
    private setResults;
    /**
     * Get the first result returned from this query
     * it will return undefined if the results array is empty
     */
    get first(): T;
    /**
     * Internally call the first getter, and check if the value is different from undefined
     * it will throw an Error in case of undefined
     */
    get firstAssert(): T;
    /**
     * Return true if there is some data returned from this query
     */
    get hasResults(): boolean;
    /**
     * Assert that this result has results by calling the getter hasResults
     *
     * @throws EmptyResult error if there's no result on this instance
     */
    assert(): void;
    /**
     * Convert the results of this query into a JSON string
     */
    toJSON(): Object;
}
