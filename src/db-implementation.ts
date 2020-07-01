'use strict';

import mysql, { Pool, PoolConnection, RowDataPacket, OkPacket } from 'mysql2';
import { QueryInterface } from './query-interface';
import { SelectResult } from './select-results';
import { InvalidOperation } from './errors/invalid-operation';

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
     * Check if a pool has been configured for this instane.
     */
    public isConfigured = (): boolean => this.pool !== null;

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
     * End DB pool connections
     */
    public end(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool?.end(function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    };

    /**
     * Run DB query
     */
    private runQuery({ query, values = {} }: QueryInterface): Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]> {
        return new Promise(async (resolve, reject) => {
            let con = await this.getConnection();

            con.query(query, values, (err, results, _fields) => {
                (con) && con.release();

                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        })
    };

    /**
     * Query a single select statement
     * 
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations, 
     * and also has the original returned values inside of it, multi statement queries are not allowed by this method
     * if the given query has more than one statement, the query will be splitted and only perform the first query
     */
    public async select<T extends Object>(q: QueryInterface): Promise<SelectResult<T>> {
        /**
         *  Ensure that multi queryes won't be processed by splitting on the ; char
         *   and getting only the first value of it
         */
        let query = q.query.split(';', 1)[0];

        let results = await this.runQuery({ query, values: q.values }) as RowDataPacket[] | RowDataPacket[][];

        let constructorName: string = Array.isArray(results[0]) ? results[0][0].constructor.name : results[0].constructor.name;

        if (Array.isArray(results) && (constructorName === "RowDataPacket" || constructorName === "TextRow")) {
            return new SelectResult(<RowDataPacket[]>results);
        } else {
            throw new InvalidOperation("The result for the query, doesn't match with a Select statement", query);
        }
    }
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
