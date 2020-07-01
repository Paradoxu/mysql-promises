import mysql, { PoolConnection } from 'mysql2';
import { QueryInterface } from './query-interface';
import { SelectResult } from './select-results';
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
     * Check if a pool has been configured for this instane.
     */
    isConfigured: () => boolean;
    /**
     * Get a connection from the pool
     * @return {Promise} resolves with the connection
     */
    getConnection: () => Promise<PoolConnection>;
    /**
     * End DB pool connections
     */
    end(): Promise<void>;
    /**
     * Run DB query
     */
    private runQuery;
    /**
     * Query a single select statement
     *
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations,
     * and also has the original returned values inside of it
     */
    select<T extends Object>(q: QueryInterface): Promise<SelectResult<T>>;
}
/**
 * Return a new DB or an existent DB instance based on the given configuration
 */
export declare function CreateDB(configuration: mysql.PoolOptions): DB;
export {};
