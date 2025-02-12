# Github Auth

## Usage

First, you'll need to setup the central authorization server:

```ts
// ~/smallweb/auth/main.ts
import { GithubAuthServer } from "jsr:@pomdtr/github-auth/server";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = Deno.env.toObject();

const authServer = new GithubAuthServer({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
});

export default authServer;
```

See [Registering a Github App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app) for how to get the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

Your app needs to have read access to the user's login, email address and public ssh keys. You can request this permission by adding the `user`, `user:email` and `read:public_key` scopes to your Github App.

Use `https://auth.smallweb.run/github/callback` as the callback URL.

Then, you'll be able use the `githubAuth` middleware to protect your routes:

```ts
// ~/smallweb/auth-demo/main.ts

import { githubAuth } from "jsr:@pomdtr/github-auth";

export default {
    fetch: githubAuth({
        issuer: "https://auth.<your-domain>",
    }, (req) => {
        return new Response(`You are logged in as ${req.headers.get("x-user-email")}`);
    }),
};
```

You can limit access to user whose public ssh key (available at `https://github.com/<user>.keys`) is in the `authorized_keys` file:

```ts
// ~/smallweb/auth-demo/main.ts
import * as path from "jsr:@std/path";

const { SMALLWEB_DIR, SMALLWEB_APP_NAME } = Deno.env.toObject();

export default {
    fetch: githubAuth({
        issuer: "https://auth.<your-domain>",
        authorizedKeys: [
            path.join(SMALLWEB_DIR, ".smallweb", "authorized_keys"), // global authorized keys
            path.join(SMALLWEB_DIR, SMALLWEB_APP_NAME, "authorized_keys"), // app-specific authorized keys
        ]
    }, (req) => {
        return new Response(`You are logged in as ${req.headers.get("x-user-email")}`);
    }),
}
```

You can also use either the username or email address to identify the user thanks to the `authorizedUsernames` and `authorizedEmails` options.
