---
outline: [2, 3]
---

# HTTP Requests

Smallweb maps every subdomains of your root domain to a directory in your root directory.

For example with, the following configuration:

```json
// ~/smallweb/.smallweb/config.json
{
    "domain": "example.com"
}
```

The routing system maps domains to directories as follows:

- Direct subdomain mapping:
  - `api.example.com` → `~/smallweb/api`
  - `blog.example.com` → `~/smallweb/blog`

- Root domain behavior:
  - Requests to `example.com` automatically redirect to `www.example.com` if the `www` directory exists
  - If the `www` directory does not exist, a 404 error is returned

> [!WARNING]
> Subdomains must be alphanumeric, and can contain hyphens. You should also avoid using uppercase letters in your subdomains, as they are usually converted to lowercase. Underscores are allowed, but not recommended.

> [!NOTE]
> Any folder starting with `.` is ignored by the routing system. You can use it to your advantage to create hidden directories that are not accessible from the web (ex: `.github`, or `.data`).

Smallweb detects the type of website you are trying to host based on the files in the directory.

- If the directory contains a `main.[js,ts,jsx,tsx]` file, it is considered a [dynamic website](#dynamic-websites).
- Else, it is considered a [static website](#static-websites).
  - if the directory contains `dist/index.html` or an `index.html` file, it is served at the root of the website.
  - if the directory contains an `index.md` file, it is rendered as html.

You can opt-out of the default behavior by creating a `smallweb.json` file at the root of the directory, and specifying the `root` and `entrypoint` fields. See [Manifest](/docs/reference/manifest.md) for more information.

## Static Websites

You can create a website by just adding an `index.html` file in the folder.

```html
<!-- File: ~/smallweb/example-static/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Example Static Website</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```

To access the website, open `https://example-static.<smallweb-domain>` in your browser.

If your static website contains a `main.js` file, but you want to serve it as a static website, yoy can create a `smallweb.json` file at the root of the directory, and specify the `entrypoint` field to `jsr:@smallweb/file-server`.

  ```json
  {
    "entrypoint": "jsr:@smallweb/file-server"
  }
  ```

### Rendering markdown

The smallweb static server automatically renders markdown files as html. If you create a file named index.md in a folder (and no `index.html`), it will be served at the root of the website.

### Single Page Applications

To serve a single page application, you need to redirect all requests to the `index.html` file. You can do this by a `_redirects` file at the root of the static directory.

```txt
/* /index.html 200
```

If you're using a tool like [Vite](https://vitejs.dev), this `_redirects` file should be added to the `public` directory.

## Dynamic Websites

Smallweb can also host dynamic websites. To create a dynamic website, you need to create a folder with a `main.[js,ts,jsx,tsx]` file in it.

The file should export a default object with a `fetch` method that takes a `Request` object as argument, and returns a `Response` object.

```ts
// File: ~/smallweb/example-server/main.ts

export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "world";

    return new Response(`Hello, ${name}!`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
}
```

To access the server, open `https://example-server.<smallweb-domain>` in your browser.

### Routing Requests using Hono

Smallweb use the [deno](https://deno.com) runtime to evaluate the server code. You get typescript and jsx support out of the box, and you can import any module from the npm and jsr registry by prefixing the module name with `npm:` or `jsr:`.

As an example, the following code snippet use the [hono package](https://hono.dev) to extract params from the request url.

```jsx
// File: ~/smallweb/hono-example/main.ts

import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.get("/", c => c.text("Hello, world!"));

app.get("/:name", c => c.text(`Hello, ${c.params.name}!`));

// Hono instances have a `fetch`, so they can be used as the default export
export default app;
```

To access the server, open `https://hono-example.<smallweb-domain>` in your browser.
