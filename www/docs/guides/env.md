# Env Variables

## Environment variables

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
- `SMALLWEB_APP_DOMAIN`: The domain of the app.
- `SMALLWEB_APP_URL`: The base URL of the app.

In addition to these, the `SMALLWEB_ADMIN` environment variable is also set for admin apps.

## Encrypted Secrets

> [!WARNING] This feature is recommended only for advanced users.

Smallweb delegates encryption to [SOPS](https://github.com/getsops/sops). Encrypted secrets are stored in a `secrets.enc.env` file at the root of your app dir.

Smallweb will automatically decrypt the file using your private ssh key (`~/.ssh/id_ed25519` by default) and inject the secrets as environment variables into your app at runtime.

> [!NOTE] This is a opinionated guide, sops support other encryption methods.
> Check the [SOPS documentation](https://github.com/getsops/sops) for more information.

On MacOS/Linux, you can install SOPS using Homebrew:

```sh
brew install sops # make sure your sops version is 3.10.0 or higher
```

Then we'll create a `.sops.yaml` file at the root of our smallweb dir:

```yaml
# ~/smallweb/.sops.yaml
creation_rules:
  - key_groups:
      - age:
          - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEPR1N/c+B7OPXEraFx2r3UHViHFbZ2Afg8VQLQ59ZKd # your ssh public key
```

From now on, we can generate/edit a `secrets.enc.env` for your app using the following command:

```sh
# edit <app> secrets
sops ./<app>/secrets.enc.env
```

> [!WARNING] Make sure to never edit the encrypted file directly!

If you add a new public key to your `.sops.yaml` file, you'll need to update the keys in your encrypted files:

```sh
# run this command at the root of your smallweb dir
sops updatekeys */secrets.enc.env
```
