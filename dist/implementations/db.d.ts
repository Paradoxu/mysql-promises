import mysql from 'mysql2';
import { QueryInterface } from './query-interface';
import { SelectResult } from './select-results';
import { QueryResult } from './query-results';
declare class DB {
    private pool;
    private configuration;
    constructor(configuration: mysql.PoolOptions);
    /**
     * Setup the Database connection pool for this instance
     * @param  {Object} config
     */
    private configure;
    /**
     * Get a connection from the pool
     * @return {Promise} resolves with the connection
     */
    private getConnection;
    /**
     * Run DB query
     */
    private runQuery;
    /**
     * Perform a query that updates the database, such as UPDATE and DELETE
     */
    private runUpdate;
    /**
    *  Ensure that multi queryes won't be processed by splitting on the ; char
    *  and getting only the first value of it
    */
    private assertSingleQuery;
    /**
     * Perform the given query and return the results generated from it
     *
     * Use this method if you wish to handle the results by your self, otherwise use the select, update and delete methods
     */
    query: <T>(q: QueryInterface) => Promise<T>;
    /**
     * Query a single select statement
     *
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations,
     * and also has the original returned values inside of it, multi statement queries are not allowed by this method
     * if the given query has more than one statement, the query will be splitted and only perform the first query
     */
    select<T extends Object>(q: QueryInterface): Promise<SelectResult<T>>;
    /**
     * Perform an Update query
     *
     * @throws InvalidOperation if the given query doesn't match an Update statement
     */
    update: (q: QueryInterface) => Promise<QueryResult>;
    /**
     * Perform a Delete query
     *
     * @throws InvalidOperation if the given query doesn't match an Update statement
     */
    delete: (q: QueryInterface) => Promise<QueryResult>;
    /**
     * Check if a pool has been configured for this instane.
     *
     * @returns true if the instance has already been configured
     */
    isConfigured: () => boolean;
    /**
     * End DB pool connections
     */
    end(): Promise<void>;
}
/**
 * Return a new DB or an existent DB instance based on the given configuration
 */
export declare function CreateDB(configuration: mysql.PoolOptions): DB;
export {};
