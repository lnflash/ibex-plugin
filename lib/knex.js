"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.setupDatabase = exports.db = void 0;
const knex_1 = require("knex");
/**
 * @description Creates a connection for postgres, which is used in the routes to access/modify data in the DB
 * @returns `Knex`
 */
let db;
async function setupDatabase() {
    exports.db = db = (0, knex_1.knex)({
        client: "pg",
        connection: {
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT),
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
        },
    });
    return db;
}
exports.setupDatabase = setupDatabase;
async function closeDatabase() {
    if (db) {
        return db.destroy();
    }
}
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=knex.js.map