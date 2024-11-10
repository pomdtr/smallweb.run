# Smallweb API

A rest API for your internet folder.

![swagger UI](./img/swagger-ui.png)

## Usage

```ts
// ~/smallweb/api/main.ts
import { bearerAuth } from "jsr:@pomdtr/bearer-auth"
import { Api } from "jsr:@smalweb/api";

const api = new Api();

export default {
    fetch: bearerAuth(api.fetch, {
        verifyToken: (token: string) => {
            return token === Deno.env.get("API_TOKEN");
        },
        publicRoutes: ["/", "/openapi.json"],
    }),
    run: api.run
};
```

```json
// ~/smallweb/api/smallweb.json
{
    "admin": true
}
```

```sh
# ~/smallweb/api/.env
API_TOKEN=my-secret-token
```
