import { db } from "@ibex/knex";
import { Invoice } from "./lightninginvoice";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "ibex_lightning_payment";

interface IbexPayInvoice {
  settleAtUtc: number;
  hash: string;
  status: number;
  failureReason: number;
  transaction: Transaction;
}

interface Transaction {
  id: string;
  createdAt: string;
  settledAt?: string;
  accountId: string;
  amount: number;
  networkFee: number;
  onChainSendFee?: number;
  exchangeRateCurrencySats: number;
  currencyId: number;
  transactionTypeId: number;
  invoice?: Invoice;
  payment: Payment;
}

interface Payment {
  bolt11: string;
  hash: string;
  preImage: string;
  memo: null;
  amountMsat: number;
  feeMsat: number;
  paidMsat: number;
  creationDateUtc: string;
  settleDateUtc: string;
  statusId: number;
  failureId: EPaymentFailureReason;
  status: Status;
  failureReason?: PaymentFailureReason;
}

interface PaymentFailureReason {
  id: EPaymentFailureReason;
  name: string;
  description: string;
}

interface Status {
  id: PaymentStatus;
  name: string;
  description: string;
}

interface IbexPayInvoiceWebhookPayload {
  webhookSecret: string;
  transaction: Transaction;
}

enum PaymentStatus {
  UNKNOWN = 0,
  SUCCEEDED = 1,
  IN_FLIGHT = 2,
  FAILED = 3,
}

enum EPaymentFailureReason {
  FAILURE_REASON_NONE = 0,
  FAILURE_REASON_TIMEOUT = 1,
  FAILURE_REASON_NO_ROUTE = 2,
  FAILURE_REASON_ERROR = 3,
  FAILURE_REASON_INCORRECT_PAYMENT_DETAILS = 4,
  FAILURE_REASON_INSUFFICIENT_BALANCE = 5,
}

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
            table.string("hash");
            table.integer("status");
            table.integer("failureReason");
            table.jsonb("transaction");
            table.integer("settleAtUtc");
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

async function insertPaymentInfoHandler(data: IbexPayInvoice) {
  // await createTable();
  // return db(TABLE_NAME).insert({ id: uuidv4(), ...data });
}

export { IbexPayInvoice, IbexPayInvoiceWebhookPayload, insertPaymentInfoHandler };
