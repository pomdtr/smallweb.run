# App Sandbox

Smallweb apps have access to:

- read access to their app folder, and the deno cache folder.
- write access to the `data` subfolder in app folder
- access to the network, to make HTTP requests.
- access to the env files defined in the `.env` files from the smallweb root folder and the app folder.

This sandbox protects the host system from malicious code, and ensures that apps can only access the resources they need.

## Admin Apps

If you want to create an app that can access the whole smallweb directory, you'll need to add the `admin` field to your `smallweb.json`:

```json
// ~/smallweb/my-admin-app/smallweb.json
{
    "admin": true
}
```

Admin apps have access to the whole smallweb directory:

```ts
const { SMALLWEB_ADMIN, SMALLWEB_DIR } = Deno.env.toObject();

if (!SMALLWEB_ADMIN) {
    throw new Error("This app is not an admin app");
}

const apps = await Deno.readDir(SMALLWEB_DIR).filter((dir) => dir.isDirectory && !strings.startsWith(dir.name, "."));
```

And are also allowed to run the `smallweb` CLI:

```ts
const { SMALLWEB_CLI_PATH } = Deno.env.toObject();

const command = new Deno.Command(SMALLWEB_CLI_PATH, {
    args: ["ls", "--json"],
});

const output = await command.output();
const apps = JSON.parse(new TextDecoder().decode(output));
```
