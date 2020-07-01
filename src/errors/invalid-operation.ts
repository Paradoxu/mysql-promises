export class InvalidOperation extends Error {
    query: string;

    constructor(message: string, query: string) {
        super(message);
        this.query = query;
    }
}