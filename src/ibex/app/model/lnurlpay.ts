import { db } from "@ibex/knex";


const TABLE_NAME = 'ibex_lnurl'

interface IbexLNURL {
    accountId: string;
    amount: number;
    lnurl: string;
    currencyId: number
}


/**
 * @description Creates the onchain address table in the DB
 * @returns `boolean | Error`
 */
const createLNURLTable = () => {
    return new Promise<boolean | Error>((resolve, reject) => {
        db.schema
            .hasTable(TABLE_NAME)
            .then((exists) => {
                if (!exists) {
                    // Create the table if it doesn't exist
                    return db.schema.createTable(TABLE_NAME, (table) => {
                        table.uuid('id').primary();
                        table.uuid('accountId');
                        table.string('amount');
                        table.string('lnurl');
                        table.integer('currencyId');
                        table.timestamp('createdAt').defaultTo(db.fn.now());
                        table.timestamp('updatedAt').defaultTo(db.fn.now());
                        // Add more columns as needed
                    });
                }
            })
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                reject(error)
            });
    })

}


async function insertLNURL(body: IbexLNURL): Promise<void> {
    await createLNURLTable();
    return db(TABLE_NAME).insert({ id: crypto.randomUUID(), ...body });
}

export { insertLNURL }