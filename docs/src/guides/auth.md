# Authentication

To protect your apps behind authentication, you can make use of a variety of authentication middlewares.

## Email / Github / Google / Facebook auth using lastlogin.net

```sh
# ~/smallweb/.env

LASTLOGIN_SECRET_KEY=your-secret-key
LASTLOGIN_EMAIL=pomdtr@smallweb.run
```

```ts
import { lastlogin } from "jsr:@pomdtr/lastlogin";

export default {
  fetch: lastlogin((req: Request) => {
    const email = req.headers.get("X-Lastlogin-Email"); // pomdtr@smallweb.run
    return new Response(`Hello, ${email}!`);
  }),
};
```
