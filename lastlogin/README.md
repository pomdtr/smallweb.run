# Lastlogin Authentication

## Usage in smallweb

First wrap your endpoint in the `lastlogin` middleware.

```ts
// ~/smallweb/lastlogin-example/main.ts
import { lastlogin } from "jsr:@pomdtr/lastlogin";

export default {
  fetch: lastlogin((req: Request) => {
    const email = req.headers.get("X-Lastlogin-Email");
    return new Response(`Hello, ${email}!`);
  }),
};
```

Then either set some options in your `.env` file:

```sh
# ~/smallweb/.env
LASTLOGIN_SECRET_KEY=my-secret-key
LASTLOGIN_EMAIL=pomdtr@gmail.com
LASTLOGIN_PROVIDER=google
```

or pass them as an object to the `lastlogin` function:

```ts
// ~/smallweb/lastlogin-example/main.ts
import { lastlogin } from "jsr:@pomdtr/lastlogin";

export default {
  fetch: lastlogin((req: Request) => {
    const email = req.headers.get("X-Lastlogin-Email");
    return new Response(`Hello, ${email}!`);
  }, {
    provider: "google",
    email: "pomdtr@gmail.com"
  })
};
```

A list of supported options can be found in the [package documentation](https://jsr.io/@pomdtr/lastlogin/doc/~/LastLoginOptions).
