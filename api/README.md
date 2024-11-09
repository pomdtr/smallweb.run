# Smallweb API

## Usage

```ts
import { bearerAuth } from "jsr:@pomdtr/bearer-auth@0.1.0";
import { api } from "./mod.ts";

const app = api();

export default {
    fetch: bearerAuth(app.fetch, {
        verifyToken: (token: string) => {
            return token === Deno.env.get("API_TOKEN");
        },
        publicRoutes: ["/", "/openapi.json"],
    }),
};
```

```sh
LASTLOGIN_SECRET_KEY=my-secret-key
```
