'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDB = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const select_results_1 = require("./select-results");
const invalid_operation_1 = require("../errors/invalid-operation");
const query_results_1 = require("./query-results");
const instances = new Map();
class DB {
    constructor(configuration) {
        this.pool = null;
        /**
         * Get a connection from the pool
         * @return {Promise} resolves with the connection
         */
        this.getConnection = () => {
            return new Promise((resolve, reject) => {
                this.pool?.getConnection((err, con) => {
                    if (err) {
                        if (con) {
                            con.release();
                        }
                        return reject(err);
                    }
                    return resolve(con);
                });
            });
        };
        /**
         * Perform the given query and return the results generated from it
         *
         * Use this method if you wish to handle the results by your self, otherwise use the select, update and delete methods
         */
        this.query = (q) => this.runQuery(q);
        /**
         * Perform an Update query
         *
         * @throws InvalidOperation if the given query doesn't match an Update statement
         */
        this.update = (q) => this.runUpdate(q, 'Update');
        /**
         * Perform a Delete query
         *
         * @throws InvalidOperation if the given query doesn't match an Update statement
         */
        this.delete = (q) => this.runUpdate(q, 'Delete');
        /**
         * Check if a pool has been configured for this instane.
         *
         * @returns true if the instance has already been configured
         */
        this.isConfigured = () => this.pool !== null;
        this.configuration = configuration;
        if (!this.isConfigured()) {
            this.configure(this.configuration);
        }
    }
    /**
     * Setup the Database connection pool for this instance
     * @param  {Object} config
     */
    configure(config) {
        this.pool = mysql2_1.default.createPool(config);
    }
    ;
    /**
     * Run DB query
     */
    runQuery({ query, values = {} }) {
        return new Promise(async (res, rej) => {
            let con = await this.getConnection();
            con.query(query, values, (err, results, _fields) => {
                (con) && con.release();
                return (err ? rej(err) : res(results));
            });
        });
    }
    ;
    /**
     * Perform a query that updates the database, such as UPDATE and DELETE
     */
    async runUpdate(q, type) {
        const query = this.assertSingleQuery(q);
        const results = await this.runQuery(query);
        const constructorName = results.constructor.name;
        if (constructorName === "OkPacket" || constructorName === "ResultSetHeader") {
            return new query_results_1.QueryResult(results);
        }
        else {
            throw new invalid_operation_1.InvalidOperation(`The result for the query, doesn't match with an ${type} statement`, query.query);
        }
    }
    /**
    *  Ensure that multi queryes won't be processed by splitting on the ; char
    *  and getting only the first value of it
    */
    assertSingleQuery(q) {
        let query = q.query.split(';', 1)[0];
        return { query, values: q.values };
    }
    /**
     * Query a single select statement
     *
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations,
     * and also has the original returned values inside of it, multi statement queries are not allowed by this method
     * if the given query has more than one statement, the query will be splitted and only perform the first query
     */
    async select(q) {
        const query = this.assertSingleQuery(q);
        const results = await this.runQuery(query);
        const constructorName = Array.isArray(results[0]) ? results[0][0]?.constructor.name : results[0]?.constructor.name;
        if (Array.isArray(results) && (constructorName === "RowDataPacket" || constructorName === "TextRow")) {
            return new select_results_1.SelectResult(results);
        }
        else {
            throw new invalid_operation_1.InvalidOperation("The result for the query, doesn't match with a Select statement", query.query);
        }
    }
    /**
     * End DB pool connections
     */
    end() {
        return new Promise((res, rej) => {
            this.pool?.end((err) => err ? rej(err) : res());
        });
    }
    ;
}
/**
 * Return a new DB or an existent DB instance based on the given configuration
 */
function CreateDB(configuration) {
    const name = `${configuration.host}_${configuration.port}`;
    if (!instances.has(name)) {
        instances.set(name, new DB(configuration));
    }
    return instances.get(name);
}
exports.CreateDB = CreateDB;
