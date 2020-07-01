import { RowDataPacket } from "mysql2";
import { EmptyResult } from "./errors/no-elements";

export class SelectResult<T extends Object>{
    public results: T[] = [];
    public originalAnswer: RowDataPacket[];

    constructor(data: RowDataPacket[]) {
        this.originalAnswer = data;
        this.setResults(data);
    }

    private setResults(data: RowDataPacket[]) {
        this.results = data.map(d => ({ ...d } as T))
    }

    /**
     * Get the first result returned from this query
     * it will return undefined if the results array is empty
     */
    get first(): T {
        return this.results[0];
    }


    /**
     * Internally call the first getter, and check if the value is different from undefined
     * it will throw an Error in case of undefined
     */
    get firstAssert(): T {
        let r = this.first;

        if (!r)
            throw new Error('No elements found');

        return r;
    }

    /**
     * Return true if there is some data returned from this query
     */
    get hasResults(): boolean {
        return this.results.length > 0;
    }

    /**
     * Assert that this result has results by calling the getter hasResults
     * 
     * @throws EmptyResult error if there's no result on this instance
     */
    assert(): void {
        if (!this.hasResults)
            throw new EmptyResult('No elements found on the result');
    }
}