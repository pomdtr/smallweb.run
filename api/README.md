# Smallweb API

## Usage

```ts
// ~/smallweb/api/main.ts
import { Smallweb } from "jsr:@smallweb/api"

const { SMALLWEB_ADMIN, SMALLWEB_DIR } = Deno.env.toObject()
if (!SMALLWEB_ADMIN) {
    throw new Error("current app is not an admin app")
}

const api = new Smallweb({
    rootDir: SMALLWEB_DIR,
})

export default api
```

```json
// ~/smallweb/.smallweb/config.json
{
    "apps": {
        "api": {
            "admin": true
        }
    }
}
```
