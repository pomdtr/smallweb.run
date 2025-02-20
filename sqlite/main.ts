import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync("./data/db.sqlite");

export default {
    fetch: () => {
    },
    run: () => {
        // Execute SQL statements from strings.
        database.exec(`
    CREATE TABLE IF NOT EXISTS data(
      key INTEGER PRIMARY KEY,
      value TEXT
    ) STRICT
  `);
        // Create a prepared statement to insert data into the database.
        // const insert = database.prepare(
        //     "INSERT INTO data (key, value) VALUES (?, ?)",
        // );
        // Execute the prepared statement with bound values.
        // insert.run(1, "hello");
        // insert.run(2, "world");
        // Create a prepared statement to read data from the database.
        const query = database.prepare("SELECT * FROM data ORDER BY key");
        // Execute the prepared statement and log the result set.
        console.log(JSON.stringify(query.all(), null, 2));
        // Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
    },
};
