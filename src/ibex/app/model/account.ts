import { db } from "@ibex/knex";

const TABLE_NAME = "ibex_account";

interface IBEXAccountData {
  id: string;
  userId: string;
  organizationId: string;
  name: string;
  currencyId: number;
}

type IBEXAccountRequestPutBody = Omit<IBEXAccountData, "id" | "userId" | "organizationId" | "currencyId">;

/**
 * @description Creates the account table in the DB
 * @returns `boolean | Error`
 */
const createTable = () => {
  return new Promise<boolean | Error>((resolve, reject) => {
    db.schema
      .hasTable(TABLE_NAME)
      .then((exists) => {
        if (!exists) {
          // Create the table if it doesn't exist
          return db.schema.createTable(TABLE_NAME, (table) => {
            table.uuid("id").primary();
            table.uuid("userId");
            table.uuid("organizationId");
            table.string("name");
            table.integer("currencyId");
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

async function createAccount(account: IBEXAccountData) {
  // await createTable();
  // return db(TABLE_NAME).insert(account);
}

async function getAccountById(accountId: string) {
  // return db(TABLE_NAME).where({ id: accountId }).first();
  return true;
}

async function updateAccount(accountId: string, updates: IBEXAccountRequestPutBody) {
  // return db(TABLE_NAME).where({ id: accountId }).update(updates);
}

async function listAccounts() {
  // return db(TABLE_NAME).select('*');
}

export { IBEXAccountData, IBEXAccountRequestPutBody, createAccount, getAccountById, updateAccount, listAccounts };
