# Smallweb Codejar

```ts
// ~/smallweb/editor/main.ts
import { codejar } from "./mod.ts";
import { lastlogin } from "@pomdtr/lastlogin";

const app = codejar();

export default {
    // gate editor behind lastlogin auth
    fetch: lastlogin(app.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
    }),
};
```

```json
// ~/smallweb/editor/smallweb.json
{
    "admin": true
}
```

```sh
# ~/smallweb/editor/.env
EMAIL=user@example.com
```
