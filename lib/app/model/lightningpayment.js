"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPaymentInfoHandler = exports.createTable = void 0;
const knex_1 = require("./knex");
const TABLE_NAME = "ibex_lightning_payment";
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["UNKNOWN"] = 0] = "UNKNOWN";
    PaymentStatus[PaymentStatus["SUCCEEDED"] = 1] = "SUCCEEDED";
    PaymentStatus[PaymentStatus["IN_FLIGHT"] = 2] = "IN_FLIGHT";
    PaymentStatus[PaymentStatus["FAILED"] = 3] = "FAILED";
})(PaymentStatus || (PaymentStatus = {}));
var EPaymentFailureReason;
(function (EPaymentFailureReason) {
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_NONE"] = 0] = "FAILURE_REASON_NONE";
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_TIMEOUT"] = 1] = "FAILURE_REASON_TIMEOUT";
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_NO_ROUTE"] = 2] = "FAILURE_REASON_NO_ROUTE";
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_ERROR"] = 3] = "FAILURE_REASON_ERROR";
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_INCORRECT_PAYMENT_DETAILS"] = 4] = "FAILURE_REASON_INCORRECT_PAYMENT_DETAILS";
    EPaymentFailureReason[EPaymentFailureReason["FAILURE_REASON_INSUFFICIENT_BALANCE"] = 5] = "FAILURE_REASON_INSUFFICIENT_BALANCE";
})(EPaymentFailureReason || (EPaymentFailureReason = {}));
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
                    table.string("hash");
                    table.integer("status");
                    table.integer("failureReason");
                    table.jsonb("transaction");
                    table.integer("settleAtUtc");
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
async function insertPaymentInfoHandler(data) {
    // await createTable();
    // return db(TABLE_NAME).insert({ id: uuidv4(), ...data });
}
exports.insertPaymentInfoHandler = insertPaymentInfoHandler;
//# sourceMappingURL=lightningpayment.js.map