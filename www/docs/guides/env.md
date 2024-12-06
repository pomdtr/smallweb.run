# Env Variables

## App-specific environment variables

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

## Global environment variables

You can set global environment variables by creating a file called `.env` at the root of the smallweb directory.

## Injected environment variables

Smallweb automatically injects the following environment variables into your app:

- `SMALLWEB_VERSION`: The version of the smallweb CLI.
- `SMALLWEB_DIR`: The directory where the smallweb apps are stored.
- `SMALLWEB_DOMAIN`: The domain where the smallweb apps are served from.
- `SMALLWEB_APP_NAME`: The name of the app.
- `SMALLWEB_APP_DOMAIN`: The domain of the app.
- `SMALLWEB_APP_URL`: The URL of the app.

And some additional variables are available to admin apps:

- `SMALLWEB_ADMIN`: Allows you to check if the app is an admin app.
- `SMALLWEB_CLI_PATH`: The path to the smallweb CLI.

## Encryption support

> [!WARNING] This feature is recommended only for advanced users.

Smallweb delegates encryption to [SOPS](https://github.com/getsops/sops).

Encrypted secrets are stored in a `secrets.enc.env` file at the root of your app dir, or in the `.smallweb` (for global secrets).

Smallweb will automatically decrypt the file and inject the secrets as environment variables into your app at runtime.

> [!NOTE] This is a opinionated guide, sops support other encryption methods.
> Check the [SOPS documentation](https://github.com/getsops/sops) for more information.

On MacOS/Linux, you can install SOPS using Homebrew:

```sh
brew install sops
```

In this guide, we will use [age](https://github.com/FiloSottile/age) to encrypt our secrets.

```sh
brew install age
```

To generate a new key pair, run the following command:

```sh
# linux / WSL
$ age-keygen -o $HOME/.config/sops/age/keys.txt
Public key: age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc

# macOS
$ age-keygen -o $HOME/Library/Application\ Support/sops/age/keys.txt
Public key: age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc
```

Then we'll create a `.sops.yaml` file at the root of our smallweb dir:

```yaml
# ~/smallweb/.sops.yaml
creation_rules:
  - key_groups:
      - age:
          - age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc # public key
```

> [!TIP] You can repeat the process to add more public keys
> Make sure to run `smallweb secrets --update-keys` after adding new public keys

From now on, we can generate/edit a `secrets.enc.env` for your app using the following command:

```sh
# app is optional in case you are in the app dir
smallweb secrets [app]

# edit global secrets
smallweb secrets -g
```

> [!WARNING] Make sure to never edit the encrypted file directly!
