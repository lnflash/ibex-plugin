"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTransaction = exports.insertAddress = void 0;
const knex_1 = require("@ibex/knex");
const ADDRESS_TABLE_NAME = "ibex_onchain_address";
const TRANSACTION_TABLE_NAME = "ibex_onchain_transaction";
/**
 * @description Creates the onchain address table in the DB
 * @returns `boolean | Error`
 */
const createAddressTable = () => {
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(ADDRESS_TABLE_NAME)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(ADDRESS_TABLE_NAME, (table) => {
                    table.uuid("id").primary();
                    table.uuid("accountId");
                    table.string("address");
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
const createTransactionTable = () => {
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(TRANSACTION_TABLE_NAME)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(TRANSACTION_TABLE_NAME, (table) => {
                    table.uuid("id").primary();
                    table.uuid("accountId");
                    table.string("address");
                    table.jsonb("transactionHub");
                    table.float("amountSat");
                    table.float("feeSat");
                    table.text("status");
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
async function insertAddress(accountId, address) {
    // await createAddressTable();
    // return db(ADDRESS_TABLE_NAME).insert({ id: uuidv4(), accountId, address });
}
exports.insertAddress = insertAddress;
async function insertTransaction(accountId, address, body) {
    // await createTransactionTable();
    // return db(TRANSACTION_TABLE_NAME).insert({ id: uuidv4(), accountId, address, ...body });
}
exports.insertTransaction = insertTransaction;
//# sourceMappingURL=onchain.js.map