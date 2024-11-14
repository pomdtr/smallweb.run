# Authentication

To protect your apps behind authentication, you can make use of a variety of authentication middlewares.

If your app is using hono, you have a variety of options to choose from:

- [Bearer Auth](https://hono.dev/docs/middleware/builtin/bearer-auth)
- [Basic Auth](https://hono.dev/docs/middleware/builtin/basic-auth)
- [Oauth](https://www.npmjs.com/package/@hono/oauth-providers)

But smallweb also provides a few authentication middlewares that you can use over any fetch handler.

- [Lastlogin](https://jsr.io/@pomdtr/lastlogin)
- [Bearer Auth](https://jsr.io/@pomdtr/bearer-auth)

Generally, you can use these middlewares by wrapping your app fetch handler with them.

```ts
// ~/smallweb/excalidraw/main.ts
import { Excalidraw } from "jsr:@pomdtr/excalidraw";
import { lastlogin } from "jsr:@pomdtr/lastlogin";

const excalidraw = new Excalidraw();
excalidraw.fetch = lastlogin(excalidraw.fetch);

export default excalidraw;
```

```sh
# ~/smallweb/excalidraw/.env

LASTLOGIN_SECRET_KEY=your-secret-key # randomly generated
LASTLOGIN_EMAIL=pomdtr@smallweb.run
```
