# Smallweb SDK

## Publishing the API

```ts
// ~/smallweb/api/main.ts
import { api } from "jsr:@smallweb/sdk"

export default api()
```

```json
// ~/smallweb/api/smallweb.json
{
    "admin": true,
    "private": true
}
```

## Publishing webdav server

```ts
// ~/smallweb/api/main.ts
import { webdav } from "jsr:@smallweb/sdk"

export default webdav()
```

```json
// ~/smallweb/api/smallweb.json
{
    "admin": true,
    "private": true
}
```

## Opening a website from an app cli

```ts
// ~/smallweb/cli/main.ts
import { open } from "jsr:@smallweb/sdk"

export default {
    async run() {
        // open can only used from the `run` method
        await open("https://smallweb.run")
    }
}
```
