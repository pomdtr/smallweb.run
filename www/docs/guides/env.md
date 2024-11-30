# Env Variables

You can set environment variables for your app by creating a file called `.env` in the application folder.

Here is an example of a `.env` file:

```txt
BEARER_TOKEN=SECURE_TOKEN
```

Use the `Deno.env.get` method to access the environment variables in your app:

```ts
// File: ~/smallweb/demo/main.ts
export default {
  fetch(req: Request) {
    return new Response(`Hello, ${Deno.env.get("BEARER_TOKEN")}`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
}
```

## Injected environment variables

Smallweb automatically injects the following environment variables into your app:

- `SMALLWEB_VERSION`: The version of the smallweb CLI.
- `SMALLWEB_DIR`: The directory where the smallweb apps are stored.
- `SMALLWEB_DOMAIN`: The domain where the smallweb apps are served from.
- `SMALLWEB_APP_NAME`: The name of the app.
- `SMALLWEB_APP_URL`: The URL of the app.

And some additional variables are available to admin apps:

- `SMALLWEB_ADMIN`: Allows you to check if the app is an admin app.
- `SMALLWEB_CLI_PATH`: The path to the smallweb CLI.
