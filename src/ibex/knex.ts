import { Knex, knex } from 'knex';
/**
 * @description Creates a connection for postgres, which is used in the routes to access/modify data in the DB
 * @returns `Knex`
 */

let db: Knex;

async function setupDatabase() {
  db = knex({
    client: "pg", // specify the database client
    connection: {
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
  });
  return db;
}

async function closeDatabase() {
  if (db) {
    return db.destroy();
  }
}

export {db, setupDatabase, closeDatabase}