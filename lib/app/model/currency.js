"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCurrency = exports.getCurrency = void 0;
const knex_1 = require("@ibex/knex");
const TABLE_NAME = "ibex_currency";
const createTable = () => {
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(TABLE_NAME)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(TABLE_NAME, (table) => {
                    table.integer("id").primary();
                    table.string("name");
                    table.string("symbol");
                    table.boolean("isFiat");
                    table.boolean("accountEnabled");
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
async function insertCurrency(currency) {
    await createTable();
    return (0, knex_1.db)(TABLE_NAME).insert(currency);
}
exports.insertCurrency = insertCurrency;
async function getCurrency() {
    const isTableExists = await knex_1.db.schema.hasTable(TABLE_NAME);
    if (!isTableExists)
        return [];
    return (0, knex_1.db)(TABLE_NAME).select("*");
}
exports.getCurrency = getCurrency;
//# sourceMappingURL=currency.js.map