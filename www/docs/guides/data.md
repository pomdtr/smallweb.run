# Storing Data

Each smallweb app has write access to a `data` directory at the root of the app dir. This is a good place to store data that your app needs to persist between requests.

## Storing Blobs

 You can use the `Deno` standard library to read and write files in the `data` directory.

## Using a json file as a database

The [lowdb](https://github.com/typicode/lowdb) library is a good choice for small apps. It allows you to use a json file as a database.

```ts
import { JsonFilePreset } from "npm:lowdb/node"

const db = await JSONFilePreset('data/db.json', { posts: [] })

const post = { id: 1, title: 'lowdb is awesome', views: 100 }

// In two steps
db.data.posts.push(post)
await db.write()

// Or in one
await db.update(({ posts }) => posts.push(post))
```

## Sqlite

If you need a more robust database, you can use the [@pomdtr/sqlite](https://jsr.io/@pomdtr/sqlite) library.

```ts
import { DB } from "jsr:@pomdtr/sqlite";

// Open a database
const db = new DB("data/test.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

// Run a simple query
for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
  db.query("INSERT INTO people (name) VALUES (?)", [name]);
}

// Print out data in table
for (const [name] of db.query("SELECT name FROM people")) {
  console.log(name);
}

// Close connection
db.close();
```

## Using an external database

Of course, you can also use an external service to store your data. I personally recommand [Turso](https://turso.tech/), which has a generous free tier.
