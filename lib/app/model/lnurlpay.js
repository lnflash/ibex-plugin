"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertLNURL = void 0;
const knex_1 = require("@ibex/knex");
const TABLE_NAME = "ibex_lnurl";
/**
 * @description Creates the onchain address table in the DB
 * @returns `boolean | Error`
 */
const createLNURLTable = () => {
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(TABLE_NAME)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(TABLE_NAME, (table) => {
                    table.uuid("id").primary();
                    table.uuid("accountId");
                    table.string("amount");
                    table.string("lnurl");
                    table.integer("currencyId");
                    table.timestamp("createdAt").defaultTo(knex_1.db.fn.now());
                    table.timestamp("updatedAt").defaultTo(knex_1.db.fn.now());
                    // Add more columns as needed
                });
            }
        })
            .then(() => {
            resolve(true);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
async function insertLNURL(body) {
    // await createLNURLTable();
    // return db(TABLE_NAME).insert({ id: uuidv4(), ...body });
}
exports.insertLNURL = insertLNURL;
//# sourceMappingURL=lnurlpay.js.map