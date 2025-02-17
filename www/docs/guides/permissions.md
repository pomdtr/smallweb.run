# Permissions

Smallweb apps have access to:

- read access to their app folder, and the deno cache folder.
- write access to the `data` subfolder in app folder
- access to the network, to make HTTP requests.
- access to the env files defined in the `.env` files from the smallweb root folder and the app folder.

This sandbox protects the host system from malicious code, and ensures that apps can only access the resources they need.

## Admin Apps

If you want to create an app that can access the whole smallweb directory, you'll need to it to the `adminApps` array in your global config (`~/.smallweb/config.json`).

```json
// ~/smallweb/.smallweb/config.json
{
    "adminApps": [
        "my-admin-app"
    ]
}
```

Admin apps have read/write access to the whole smallweb dir (except the special `.smallweb` dir).

```ts
const { SMALLWEB_ADMIN, SMALLWEB_DIR } = Deno.env.toObject();

if (!SMALLWEB_ADMIN) {
    throw new Error("This app is not an admin app");
}

const apps = await Deno.readDir(SMALLWEB_DIR).filter((dir) => dir.isDirectory && !strings.startsWith(dir.name, "."));
```
