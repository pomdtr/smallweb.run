### Setting env variables

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

If you want to set an environment variable for all your apps, you can create a `.env` file in the at the root of your smallweb dir.

```json
// ~/smallweb/.env
GLOBAL_VAR=GLOBAL_VALUE
```
