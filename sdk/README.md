# Smallweb SDK

## Publishing the API

```ts
// ~/smallweb/api/main.ts
import { Api } from "jsr:@smallweb/sdk"

const api = new Api({
    verifyToken: (token: string) => {
        return token === Deno.env.get("SMALLWEB_API_TOKEN")
    }
})

export default api
```
