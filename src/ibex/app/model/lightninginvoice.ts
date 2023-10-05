import { db } from "@ibex/knex";

const TABLE_NAME = "ibex_lightning_invoice";

interface IBEXLightningInvoice {
  id: string;
  createdAt: Date;
  settledAt: null;
  accountId: string;
  amount: number;
  networkFee: number;
  onChainSendFee: number;
  exchangeRateCurrencySats: number;
  currencyId: number;
  transactionTypeId: number;
  transactionType: TransactionType;
  invoice: Invoice;
}

interface Invoice {
  hash: string;
  bolt11: string;
  preImage: string;
  memo: string;
  creationDateUtc: string;
  expiryDateUtc: string;
  settleDateUtc: string;
  amountMsat: number;
  receiveMsat: number;
  stateId: number;
  state: TransactionType;
}

interface TransactionType {
  id: number;
  name: string;
  description: string;
}

interface Transaction {
  id: string;
  createdAt: string;
  accountId: string;
  amount: number;
  networkFee: number;
  exchangeRateCurrencySats: number;
  currencyID: number;
  transactionTypeId: number;
  invoice: Invoice;
}
interface IBEXLightningInvoiceWebhookPayload {
  hash: string;
  settledAtUtc: string;
  receivedMsat: number;
  webhookSecret: string;
  transaction: Transaction;
}
enum InvoiceState {
  OPEN = 0,
  SETTLED = 1,
  CANCEL = 2,
  ACCEPTED = 3,
}

/**
 * @description Creates the Lightning Invoice table in the DB
 * @returns `boolean | Error`
 */
export const createTable = () => {
  const tableName = TABLE_NAME;
  return new Promise<boolean | Error>((resolve, reject) => {
    db.schema
      .hasTable(tableName)
      .then((exists) => {
        if (!exists) {
          // Create the table if it doesn't exist
          return db.schema.createTable(tableName, (table) => {
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
            table.timestamp("createdAt").defaultTo(db.fn.now());
            table.timestamp("updatedAt").defaultTo(db.fn.now());
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

async function createLightningInvoice(data: IBEXLightningInvoice) {
  // await createTable();
  // return db(TABLE_NAME).insert({ ...data, totalFee: data.networkFee + data.onChainSendFee });
}

async function getLightningInvoiceByBoult11(boultll: string) {
  return true;
}
async function updateLightningInvoiceByBoult11(boultll: string, body?: Invoice, settledAt?: string, fee?: number) {
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

async function deleteLightningInvoice(boultll: string) {
  // return db(TABLE_NAME).delete().whereRaw(`invoice->>'bolt11'='${boultll}'`);
}

export {
  IBEXLightningInvoice,
  IBEXLightningInvoiceWebhookPayload,
  Invoice,
  InvoiceState,
  createLightningInvoice,
  getLightningInvoiceByBoult11,
  updateLightningInvoiceByBoult11,
  deleteLightningInvoice,
};
