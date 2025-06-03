# Storing Data

Each smallweb app has write access to a `data` directory at the root of the app dir. This is a good place to store data that your app needs to persist between requests.

## Storing Blobs

 You can use the `Deno` standard library to read and write files in the `data` directory.

## Using a json file as a database

The [lowdb](https://github.com/typicode/lowdb) library is a good choice for small apps. It allows you to use a json file as a database.

```ts
import { JSONFilePreset } from "npm:lowdb/node"

const db = await JSONFilePreset('data/db.json', { posts: [] })

// read existing posts
console.log(db.data.posts)

// add new post
const post = { id: 1, title: 'lowdb is awesome', views: 100 }

// In two steps
db.data.posts.push(post)
await db.write()

// Or in one
await db.update(({ posts }) => posts.push(post))
```

## Sqlite

If you need a more robust database, you can use the `node:sqlite` package.

```ts
import { DatabaseSync } from 'node:sqlite';

// Open a database
const db = new DatabaseSync('data/test.db');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  ) STRICT
`);

// Insert data
const insert = db.prepare('INSERT INTO people (name) VALUES (?)');
for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
  insert.run(name);
}

// Query and print data
const query = db.prepare('SELECT name FROM people');
const results = query.all();
for (const row of results) {
  console.log(row.name);
}
```

## Using an external database

Of course, you can also use an external service to store your data. I personally recommend [Turso](https://turso.tech/), which has a generous free tier.
