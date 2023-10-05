import { db } from "@ibex/knex";

const TABLE_NAME = "ibex_currency";

interface IBEXCurrency {
  currencies: Currency[];
}
interface Currency {
  id: number;
  name: string;
  isFiat: boolean;
  symbol: string;
  accountEnabled: boolean;
}

const createTable = () => {
  return new Promise<boolean | Error>((resolve, reject) => {
    db.schema
      .hasTable(TABLE_NAME)
      .then((exists) => {
        if (!exists) {
          // Create the table if it doesn't exist
          return db.schema.createTable(TABLE_NAME, (table) => {
            table.integer("id").primary();
            table.string("name");
            table.string("symbol");
            table.boolean("isFiat");
            table.boolean("accountEnabled");
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

async function insertCurrency(currency: Currency[]): Promise<any> {
  await createTable();
  return db(TABLE_NAME).insert(currency);
}

async function getCurrency(): Promise<Currency[] | []> {
  const isTableExists = await db.schema.hasTable(TABLE_NAME);
  if (!isTableExists) return [];
  return db(TABLE_NAME).select("*");
}

export { IBEXCurrency, getCurrency, insertCurrency };
