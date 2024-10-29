# Smallweb Readme

Publish the README from any smallweb app.

```ts
// ~/smallweb/readme/main.ts

export default readme({
    apiUrl: Deno.env.get("SMALLWEB_API_URL"),
    apiToken: Deno.env.get("SMALLWEB_API_TOKEN"),
});
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
