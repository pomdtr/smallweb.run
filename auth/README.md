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
        return new Response(`You are logged in as ${req.headers.get("Remote-Email")}`);
    }),
};
```

You can limit access to specific users, emaill, or public keys by using the `authorizedUsernames`, `authorizedEmails` and `authorizedKeys` options:

```ts
// ~/smallweb/auth-demo/main.ts
import * as path from "jsr:@std/path";

export default {
    fetch: githubAuth({
        issuer: "https://auth.<your-domain>",
        // only pomdtr can accessd this app
        authorizedUsers: ["pomdtr"],
    }, (req) => {
        return new Response(`You are logged in as ${req.headers.get("Remote-User")}, your email is ${req.headers.get("Remote-Email")}`);
    }),
}
```
