"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccounts = exports.updateAccount = exports.getAccountById = exports.createAccount = void 0;
const knex_1 = require("@ibex/knex");
const TABLE_NAME = "ibex_account";
/**
 * @description Creates the account table in the DB
 * @returns `boolean | Error`
 */
const createTable = () => {
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(TABLE_NAME)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(TABLE_NAME, (table) => {
                    table.uuid("id").primary();
                    table.uuid("userId");
                    table.uuid("organizationId");
                    table.string("name");
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
async function createAccount(account) {
    // await createTable();
    // return db(TABLE_NAME).insert(account);
}
exports.createAccount = createAccount;
async function getAccountById(accountId) {
    // return db(TABLE_NAME).where({ id: accountId }).first();
    return true;
}
exports.getAccountById = getAccountById;
async function updateAccount(accountId, updates) {
    // return db(TABLE_NAME).where({ id: accountId }).update(updates);
}
exports.updateAccount = updateAccount;
async function listAccounts() {
    // return db(TABLE_NAME).select('*');
}
exports.listAccounts = listAccounts;
//# sourceMappingURL=account.js.map