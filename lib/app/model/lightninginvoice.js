"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLightningInvoice = exports.updateLightningInvoiceByBoult11 = exports.getLightningInvoiceByBoult11 = exports.createLightningInvoice = exports.InvoiceState = exports.createTable = void 0;
const knex_1 = require("./knex");
const TABLE_NAME = "ibex_lightning_invoice";
var InvoiceState;
(function (InvoiceState) {
    InvoiceState[InvoiceState["OPEN"] = 0] = "OPEN";
    InvoiceState[InvoiceState["SETTLED"] = 1] = "SETTLED";
    InvoiceState[InvoiceState["CANCEL"] = 2] = "CANCEL";
    InvoiceState[InvoiceState["ACCEPTED"] = 3] = "ACCEPTED";
})(InvoiceState || (exports.InvoiceState = InvoiceState = {}));
/**
 * @description Creates the Lightning Invoice table in the DB
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
                    table.float("amount");
                    table.integer("networkFee");
                    table.integer("onChainSendFee");
                    table.integer("totalFee");
                    table.float("exchangeRateCurrencySats");
                    table.integer("currencyId");
                    table.integer("transactionTypeId");
                    table.jsonb("transactionType");
                    table.jsonb("invoice");
                    table.timestamp("settledAt");
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
async function createLightningInvoice(data) {
    // await createTable();
    // return db(TABLE_NAME).insert({ ...data, totalFee: data.networkFee + data.onChainSendFee });
}
exports.createLightningInvoice = createLightningInvoice;
async function getLightningInvoiceByBoult11(boultll) {
    return true;
}
exports.getLightningInvoiceByBoult11 = getLightningInvoiceByBoult11;
async function updateLightningInvoiceByBoult11(boultll, body, settledAt, fee) {
    // if (settledAt && body) {
    //     return db(TABLE_NAME)
    //         .update('invoice', body)
    //         .update('settledAt', settledAt)
    //         .update('updatedAt', db.fn.now())
    //         .whereRaw(`invoice->>'bolt11'='${boultll}'`);
    // } else if (fee) {
    //     return db(TABLE_NAME)
    //         .update('totalFee', fee)
    //         .update('updatedAt', db.fn.now())
    //         .whereRaw(`invoice->>'bolt11'='${boultll}'`);
    // } else if (body) {
    //     return db(TABLE_NAME)
    //         .update('invoice', body)
    //         .update('updatedAt', db.fn.now())
    //         .whereRaw(`invoice->>'bolt11'='${boultll}'`);
    // }
}
exports.updateLightningInvoiceByBoult11 = updateLightningInvoiceByBoult11;
async function deleteLightningInvoice(boultll) {
    // return db(TABLE_NAME).delete().whereRaw(`invoice->>'bolt11'='${boultll}'`);
}
exports.deleteLightningInvoice = deleteLightningInvoice;
//# sourceMappingURL=lightninginvoice.js.map