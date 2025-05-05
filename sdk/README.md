# Smallweb SDK

## Usage

```ts
import { Smallweb } from "jsr:@smallweb/sdk"

const dir = "/smallweb"

const smallweb = new Smallweb(dir)

const apps = await smallweb.apps.list()
```

If you use the smallweb SDK from smallweb, you do not need to pass the directory (it will be set automatically using the `SMALLWEB_DIR` environment variable).

```ts
// $SMALLWEB_DIR/sdk-example/main.ts

import { Smallweb } from "jsr:@smallweb/sdk"
import { Hono } from "npm:hono"

const smallweb = new Smallweb()

const app = new Hono()

app.get("/", async (c) => {
    return c.json(await smallweb.apps.list())
})

app.get("/:app", async (c) => {
    return c.json(await smallweb.apps.get(c.req.param("app")))
})

export default app
```

Make sure that set the `admin` flag to `true` in your global smallweb config (as the sdk need read/write access to the whole smallweb directory).

```json
// $SMALLWEB_DIR/.smallweb/config.json
{
    "apps": {
        "sdk-example": {
            "admin": true
        }
    }
}
```
