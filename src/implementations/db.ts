'use strict';

import mysql, { Pool, PoolConnection, RowDataPacket, OkPacket, Query, ResultSetHeader } from 'mysql2';
import { QueryInterface } from './query-interface';
import { SelectResult } from './select-results';
import { InvalidOperation } from '../errors/invalid-operation';
import { QueryResult } from './query-results';

const instances: Map<string, DB> = new Map();

class DB {
    private pool: Pool | null = null;
    private configuration: mysql.PoolOptions;

    constructor(configuration: mysql.PoolOptions) {
        this.configuration = configuration;

        if (!this.isConfigured()) {
            this.configure(this.configuration);
        }
    }

    /**
     * Setup the Database connection pool for this instance
     * @param  {Object} config
     */
    private configure(config: mysql.PoolOptions) {
        this.pool = mysql.createPool(config);
    };

    /**
     * Get a connection from the pool
     * @return {Promise} resolves with the connection
     */
    private getConnection = (): Promise<PoolConnection> => {
        return new Promise((resolve, reject) => {
            this.pool?.getConnection((err, con) => {
                if (err) {
                    if (con) {
                        con.release();
                    }
                    return reject(err);
                }
                return resolve(con);
            })
        })
    };

    /**
     * Run DB query
     */
    private runQuery({ query, values = {} }: QueryInterface): Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]> {
        return new Promise(async (res, rej) => {
            let con = await this.getConnection();

            con.query(query, values, (err, results, _fields) => {
                (con) && con.release();
                return (err ? rej(err) : res(results));
            });
        })
    };

    /**
     * Perform a query that updates the database, such as UPDATE and DELETE
     */
    private async runUpdate(q: QueryInterface, type: 'Update' | 'Delete'): Promise<QueryResult> {
        const query = this.assertSingleQuery(q);
        const results = await this.runQuery(query) as OkPacket;
        const constructorName = results.constructor.name;

        if (constructorName === "OkPacket" || constructorName === "ResultSetHeader") {
            return new QueryResult(results);
        } else {
            throw new InvalidOperation(`The result for the query, doesn't match with an ${type} statement`, query.query);
        }
    }


    /**
    *  Ensure that multi queryes won't be processed by splitting on the ; char
    *  and getting only the first value of it
    */
    private assertSingleQuery(q: QueryInterface): QueryInterface {
        let query = q.query.split(';', 1)[0];
        return { query, values: q.values };
    }

    /**
     * Perform the given query and return the results generated from it
     * 
     * Use this method if you wish to handle the results by your self, otherwise use the select, update and delete methods
     */
    public query = <T>(q: QueryInterface): Promise<T> => this.runQuery(q) as any;

    /**
     * Query a single select statement
     * 
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations, 
     * and also has the original returned values inside of it, multi statement queries are not allowed by this method
     * if the given query has more than one statement, the query will be splitted and only perform the first query
     */
    public async select<T extends Object>(q: QueryInterface): Promise<SelectResult<T>> {
        const query = this.assertSingleQuery(q);
        const results = await this.runQuery(query) as RowDataPacket[] | RowDataPacket[][];
        const constructorName: string = Array.isArray(results[0]) ? results[0][0]?.constructor.name : results[0]?.constructor.name;

        if (Array.isArray(results) && (constructorName === "RowDataPacket" || constructorName === "TextRow")) {
            return new SelectResult(<RowDataPacket[]>results);
        } else {
            throw new InvalidOperation("The result for the query, doesn't match with a Select statement", query.query);
        }
    }

    /**
     * Perform an Update query
     * 
     * @throws InvalidOperation if the given query doesn't match an Update statement
     */
    public update = (q: QueryInterface) => this.runUpdate(q, 'Update');


    /**
     * Perform a Delete query
     * 
     * @throws InvalidOperation if the given query doesn't match an Update statement
     */
    public delete = (q: QueryInterface) => this.runUpdate(q, 'Delete');

    /**
     * Check if a pool has been configured for this instane.
     * 
     * @returns true if the instance has already been configured
     */
    public isConfigured = (): boolean => this.pool !== null;

    /**
     * End DB pool connections
     */
    public end(): Promise<void> {
        return new Promise((res, rej) => {
            this.pool?.end((err) => err ? rej(err) : res());
        });
    };
}

/**
 * Return a new DB or an existent DB instance based on the given configuration
 */
export function CreateDB(configuration: mysql.PoolOptions): DB {
    const name = `${configuration.host}_${configuration.port}`;
    if (!instances.has(name)) {
        instances.set(name, new DB(configuration));
    }
    return instances.get(name) as DB;
}
