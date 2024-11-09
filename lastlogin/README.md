# Lastlogin Authentication

## Usage in smallweb

```ts
// ~/smallweb/lastlogin-example/main.ts
import { lastlogin } from "jsr:@pomdtr/lastlogin";

const handler = (req: Request) => {
  const email = req.headers.get("X-Lastlogin-Email");
  return new Response(`Hello, ${email}!`);
};

export default {
  fetch: lastlogin(handler, {
    provider: "google",
    private: true,
    verifyEmail: (email: string) => {
      return email == Deno.env.get("EMAIL");
    },
  }),
};
```

```sh
# ~/smallweb/lastlogin-example/.env
LASTLOGIN_SECRET_KEY=my-secret-key
```
