"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLightningAddress = exports.updateLightningAddress = exports.getLightningAddressesByAccountById = exports.createLightningAddress = exports.createTable = void 0;
const knex_1 = require("@ibex/knex");
const TABLE_NAME = "ibex_lightning_address";
/**
 * @description Creates the Lightning Address table in the DB
 * @returns `boolean | Error`
 */
const createTable = () => {
    const tableName = TABLE_NAME;
    return new Promise((resolve, reject) => {
        knex_1.db.schema
            .hasTable(tableName)
            .then((exists) => {
            if (!exists) {
                // Create the table if it doesn't exist
                return knex_1.db.schema.createTable(tableName, (table) => {
                    table.uuid("id").primary();
                    table.uuid("accountId");
                    table.string("username");
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
exports.createTable = createTable;
async function createLightningAddress({ id, accountId, username }) {
    // await createTable();
    // return db(TABLE_NAME).insert({id, accountId, username});
}
exports.createLightningAddress = createLightningAddress;
async function getLightningAddressesByAccountById(accountId) {
    return true;
}
exports.getLightningAddressesByAccountById = getLightningAddressesByAccountById;
async function updateLightningAddress(accountId, updates) {
    // return db(TABLE_NAME).where({ id: accountId }).update(updates);
}
exports.updateLightningAddress = updateLightningAddress;
async function deleteLightningAddress(addressId) {
    // return db(TABLE_NAME).delete().where({ id: addressId });
}
exports.deleteLightningAddress = deleteLightningAddress;
//# sourceMappingURL=lightningaddress.js.map