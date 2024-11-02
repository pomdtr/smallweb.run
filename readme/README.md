# Smallweb Readme

Publish the README from any smallweb app.

```ts
// ~/smallweb/readme/main.ts
import { createReadme } from "jsr:@pomdtr/readme";

export default createReadme();
```

Use the publicRoutes parameter to whitelist files you want to be accessible.

```json
{
    "private": true,
    "publicRoutes": [
        "/todo",
        "/readme"
    ]
}
```

You can preview this file from <https://readme.smallweb.run/readme>.
