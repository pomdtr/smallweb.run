# Handling HTTP Requests

> ℹ️ All the websites hosted under the `smallweb.run` domain are open-source.
>
> You can find their source code in the [smallweb.run monorepo](https://github.com/pomdtr/smallweb.run).

Smallweb detects the type of website you are trying to host based on the files in the directory.

- If the directory contains a `main.[js,ts,jsx,tsx]` file, it is considered a [dynamic website](#dynamic-websites).
- Else, it is considered a [static website](#static-websites).
  - if the directory contains `dist/index.html` or an `index.html` file, it is served at the root of the website.
  - if the directory contains an `index.md` file, it is rendered as html.

You can opt-out of the default behavior by creating a `smallweb.json` file at the root of the directory, and specifying the `root` and `entrypoint` fields. See [App Config](/docs/reference/app-config.md) for more information.

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

To access the website, open `https://example-static.localhost` in your browser.

The static server also supports transpiling `.ts`, `.tsx`, `.jsx`, meaning that you can just import them from your static website.

```html
<!-- ~/smallweb/example-static/index.html -->
<!DOCTYPE html>
<html>

<head>
    <title>Example Static Website</title>
</head>

<body>
    <div id="root"></div>
    <script type="module" src="./script.tsx"></script>
</body>
```

You'll need to add a pragma to the script file to tell smallweb how to transpile it.

```tsx
// ~/smallweb/example-static/script.tsx
/** @jsxImportSource https://esm.sh/react@19.0.0 **/
import { createRoot } from "https://esm.sh/react-dom@19.0.0/client";

const root = createRoot(document.getElementById("root")!);
root.render(<h1>Hello, world!</h1>);
```

Only use imports that are usable from the browser. `jsr:` and `npm:` specifiers are not supported in the browser.

If your static website contains a `main.js` file, but you want to serve it as a static website, you can do the following:

- rename it to something else
- create a smallweb.json with the following content:

### Rendering markdown

The smallweb static server automatically renders markdown files as html. If you create a file named index.md in a folder (and no `index.html`), it will be served at the root of the website.

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

To access the server, open `https://example-server.localhost` in your browser.

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

To access the server, open `https://hono-example.localhost` in your browser.
