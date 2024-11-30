# Secrets

Smallweb delegates encryption to [SOPS](https://github.com/getsops/sops).

If your app dir contains a `secrets.enc.env` file encrypted with SOPS, Smallweb will automatically decrypt it and inject the secrets it contains as environment variables into your app.

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
$ age-keygen -o $HOME/Library/Application Support/sops/age/keys.txt
Public key: age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc
```

Then we'll create a `.sops.yaml` file at the root of our smallweb dir:

```yaml
creation_rules:
  - key_groups:
      - age:
          - age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc # public key
```

> [!INFO] You can repeat the process to add more public keys
> ex: <https://github.com/pomdtr/smallweb.run/tree/main/.sops.yaml>

From now on, we can generate/edit a`secrets.enc.env` using the following command:

```sh
sops secrets.enc.env
```

> [!WARNING] Make sure to never edit the encrypted file directly!

If you want to use a smallweb subcommand instead, you can create a plugin at `$SMALLWEB_DIR/.smallweb/plugins/secrets.sh`:

```sh
#!/bin/sh

if [ ! -f secrets.enc.json ]; then
    exec sops "$SMALLWEB_DIR/.smallweb/secrets.enc.env"
fi

exec sops secrets.enc.env
```
