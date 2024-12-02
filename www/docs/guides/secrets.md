# Handling Secrets

Smallweb delegates encryption to [SOPS](https://github.com/getsops/sops).

Encrypted secrets are stored in a `secrets.enc.env` file at the root of your app dir, or in the `.smallweb` (for global secrets).

Smallweb will automatically decrypt the file and inject the secrets as environment variables into your app at runtime.

## Usage

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
