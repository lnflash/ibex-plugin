
import { db } from '@ibex/knex';
import {v4 as uuidv4} from 'uuid';

const ADDRESS_TABLE_NAME = 'ibex_onchain_address';

const TRANSACTION_TABLE_NAME = 'ibex_onchain_transaction'

interface IbexOnchainTransaction {
    transactionHub: TransactionHub;
    amountSat: number;
    feeSat: number;
    status: string;
}

interface TransactionHub {
    id: string;
    createdAt: Date;
    settledAt: Date;
    accountId: string;
    amount: number;
    networkFee: number;
    onChainSendFee: number;
    exchangeRateCurrencySats: number;
    currencyId: number;
    transactionTypeId: number;
}

interface IbexOnchainTransactionWebhookPayload {
    transactionId: string;
    amountSat: number;
    status: string;
    networkTransactionId: string;
    blockConfirmations: number;
    webhookSecret: string;
}


/**
 * @description Creates the onchain address table in the DB
 * @returns `boolean | Error`
 */
const createAddressTable = () => {
    return new Promise<boolean | Error>((resolve, reject) => {
        db.schema
            .hasTable(ADDRESS_TABLE_NAME)
            .then((exists) => {
                if (!exists) {
                    // Create the table if it doesn't exist
                    return db.schema.createTable(ADDRESS_TABLE_NAME, (table) => {
                        table.uuid('id').primary();
                        table.uuid('accountId');
                        table.string('address');
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

const createTransactionTable = () => {
    return new Promise<boolean | Error>((resolve, reject) => {
        db.schema
            .hasTable(TRANSACTION_TABLE_NAME)
            .then((exists) => {
                if (!exists) {
                    // Create the table if it doesn't exist
                    return db.schema.createTable(TRANSACTION_TABLE_NAME, (table) => {
                        table.uuid('id').primary();
                        table.uuid('accountId');
                        table.string('address');
                        table.jsonb('transactionHub');
                        table.float('amountSat');
                        table.float('feeSat');
                        table.text('status');
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


async function insertAddress(accountId: string, address: string) {
    await createAddressTable();
    return db(ADDRESS_TABLE_NAME).insert({ id: uuidv4(), accountId, address });
}

async function insertTransaction(accountId: string, address: string, body: IbexOnchainTransaction) {
    await createTransactionTable();
    return db(TRANSACTION_TABLE_NAME).insert({ id: uuidv4(), accountId, address, ...body });
}

export { IbexOnchainTransaction, IbexOnchainTransactionWebhookPayload, insertAddress, insertTransaction }