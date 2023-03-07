/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "vendors_db.sqlite");

export const VendorDB = {
  vendorTableName: "vendors",
  db: null,
  ready: null,

  create: async function ({ id }) {
    await this.ready;

    const query = `
      INSERT INTO ${this.vendorTableName}
      (id)
      VALUES (?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [id]);
    return rawResults[0].id;
  },

  read: async function () {
    await this.ready;
    return await this.__query(` SELECT * FROM ${this.vendorTableName}`);
  },


  __hasVendorID: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.vendorTableName]);
    return rows.length
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {
    /* Initializes the connection to the database */
    this.db.db = this.db.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasVendorID = await this.__hasVendorID();
    console.log("initializing with", hasVendorID, "tables")
    if (hasVendorID) {
      this.ready = Promise.resolve();

      /* Create the vendor table if it hasn't been created */
    } else {
      const query = `
        CREATE TABLE ${this.vendorTableName} (
          id VARCHAR(511),
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;

      /* Tell the various CRUD methods that they can execute */
      this.ready = this.__query(query);
    }
  },

  /* Perform a query on the database. Used by the various CRUD methods. */
  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },
};