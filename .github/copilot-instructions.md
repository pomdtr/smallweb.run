This repository contains smallweb apps (one per subfolder). This folder is linked with the `smallweb.run` domain, so every subfolder will be served at `https://<subfolder>.smallweb.run`.

To generate a new smallweb app, just create a new subfolder, and create a `main.ts` file in it. If an app folder does not contains a `main.ts` file, it's content will be served as static files.

The `main.ts` file should export an object with a `fetch` method that takes a `Request` object and returns a `Response` object.

For example:

```ts
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response('Hello, world!');
  }
};
```

Apps are run using Deno. You can use any Deno APIs in your app, and should use `jsr:` or `npm:` imports for third-party modules.

Always use `npm:hono` for routing. Here's an example:

```ts
import { Hono } from 'npm:hono';

const app = new Hono();

app.get("/", c => {
    c.text("Hello, world!");
});

// this work app has a fetch method
export default app;
```

Smallweb apps only have read-access to their own folder, and can only write to the `data` subfolder (contained in the app's folder). You can use this folder to:

- Store data as files (e.g. JSON, CSV, etc.)
- Use a json file as a database thanks to the `npm:lowdb` package
- Store SQLite databases (use the `node:sqlite` package)
