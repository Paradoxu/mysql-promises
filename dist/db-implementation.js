'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDB = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const select_results_1 = require("./select-results");
const invalid_operation_1 = require("./errors/invalid-operation");
const instances = new Map();
class DB {
    constructor(configuration) {
        this.pool = null;
        /**
         * Check if a pool has been configured for this instane.
         */
        this.isConfigured = () => this.pool !== null;
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
     * End DB pool connections
     */
    end() {
        return new Promise((resolve, reject) => {
            this.pool?.end(function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    ;
    /**
     * Run DB query
     */
    runQuery({ query, values = {} }) {
        return new Promise(async (resolve, reject) => {
            let con = await this.getConnection();
            con.query(query, values, (err, results, _fields) => {
                (con) && con.release();
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    ;
    /**
     * Query a single select statement
     *
     * @returns A SelectResult, a wrapper that can be helpful on perfoming simple operations,
     * and also has the original returned values inside of it
     */
    async select(q) {
        /**
         *  Ensure that multi queryes won't be processed by splitting on the ; char
         *   and getting only the first value of it
         */
        let query = q.query.split(';', 1)[0];
        let results = await this.runQuery({ query, values: q.values });
        let constructorName = Array.isArray(results[0]) ? results[0][0].constructor.name : results[0].constructor.name;
        if (Array.isArray(results) && (constructorName === "RowDataPacket" || constructorName === "TextRow")) {
            return new select_results_1.SelectResult(results);
        }
        else {
            throw new invalid_operation_1.InvalidOperation("The result for the query, doesn't match with a Select statement", query);
        }
    }
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
