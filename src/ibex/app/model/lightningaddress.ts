import { db } from "@ibex/knex";

const TABLE_NAME = "ibex_lightning_address";

interface IBEXLightningAddressData {
  id: string;
  accountId: string;
  username: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

type IBEXLightningAddressPutBody = Omit<IBEXLightningAddressData, "id" | "accountId" | "webhookUrl" | "webhookSecret">;

/**
 * @description Creates the Lightning Address table in the DB
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
            table.string("username");
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

async function createLightningAddress({ id, accountId, username }: IBEXLightningAddressData) {
  // await createTable();
  // return db(TABLE_NAME).insert({id, accountId, username});
}

async function getLightningAddressesByAccountById(accountId: string) {
  return true;
}

async function updateLightningAddress(accountId: string, updates: IBEXLightningAddressPutBody) {
  // return db(TABLE_NAME).where({ id: accountId }).update(updates);
}

async function deleteLightningAddress(addressId: string) {
  // return db(TABLE_NAME).delete().where({ id: addressId });
}

export {
  IBEXLightningAddressData,
  IBEXLightningAddressPutBody,
  createLightningAddress,
  getLightningAddressesByAccountById,
  updateLightningAddress,
  deleteLightningAddress,
};
