# Authentication with OpenID Connect

## Using a public OIDC provider

You can instruct smallweb to authenticate users using OpenID connect. The easiest to get started is to use [Lastlogin](https://lastlogin.net), a public OIDC provider that do not require a registration process.

Firt, set the `oidc.issuer` field in your smallweb config:

```json
// $SMALLWEB_DIR/.smallweb/config.json
{
    "domain": "example.com",
    "oidc": {
        "issuer": "https://lastlogin.net"
    },
    "authorizedEmails": [
        "your-email@example.com"
    ]
}
```

Then, set the `private` field to `true` in your app manifest:

```json
// $SMALLWEB_DIR/demo/smallweb.json
{
    "private": true
}
```

The next time you'll access `demo.example.com`, you'll need to confirm your email address using lastlogin. Once you do that, you'll be redirected to your app.

You can access the email of the current user using the `Remote-Email` header:

```ts
// $SMALLWEB_DIR/demo/main.ts
export default {
    fetch(req: Request) {
        const email = req.headers.get("Remote-Email");
        return new Response(`Hello, ${email}`, {
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}
```

If you want to only protect specific routes, set the `privateRoutes` and `publicRoutes` array in your app manifest. Smallweb uses [doublestar](https://github.com/bmatcuk/doublestar) to check request paths against the global patterns

## Hosting your own OIDC provider from smallweb

Nothing stops you from using an internal url as the issuer !

```json
{
    "domain": "example.com",
    "oidc": {
        "issuer": "https://auth.example.com"
    },
    "authorizedEmails": [
        "your-email@example.com"
    ]
}
```

In this case, the `auth` app should exposes an OIDC provider. I recommend using [openauth](https://github.com/toolbeam/openauth).

> [!WARNING]
> Openauth does not support beeing used as an OIDC provider yet, so I've built [a wrapper](https://jsr.io/@pomdtr/openauth-oidc) to add support for it.
> Make sure to follow [this issue](https://github.com/toolbeam/openauth/issues/134) for official support.

```ts
// ~/smallweb/auth/main.ts

import { issuer } from "npm:@openauthjs/openauth";
import { oidc } from "jsr:@pomdtr/openauth-oidc";
import { MemoryStorage } from "npm:@openauthjs/openauth/storage/memory";

const storage = new MemoryStorage({
    persist: "./data/db.json",
})

const iss = issuer({
    storage,
    // ...
})

export default oidc(iss, storage);
```

Openauth support a bunch of issuers (Google, Github, etc), refer to [their documentation](https://openauth.js.org/docs/) for more information.

Smallweb use the app origin as the `client_id`, and no `client_secret`. You can read more about the logic behind these choices at <https://lastlogin.net/developers/>.
