# Secrets

Smallweb delegates encryption to [SOPS](https://github.com/getsops/sops).

If your app dir contains a `secrets.enc.json` file encrypted with SOPS, Smallweb will automatically decrypt it and inject the secrets it contains as environment variables into your app.

## Usage

> [!NOTE] This is a opinionated guide, sops support other encryption methods.
> Check the [SOPS documentation](https://github.com/getsops/sops) for more information.

On MacOS/Linux, you can install SOPS using Homebrew:

```sh
brew install sops
```

In this guide, we will use [age](https://github.com/FiloSottile/age) to encrypt our secrets.

To generate a new key pair, run the following command:

```sh
# linux / WSL
$ age-keygen -o $HOME/.config/sops/age/keys.txt
Public key: age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc

# macOS
$ age-keygen -o $HOME/Library/Application Support/sops/age/keys.txt
Public key: age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc
```

Then we'll create a `.sops.yaml` file in the root of our smallweb dir:

```yaml
creation_rules:
  - key_groups:
      - age:
          - age1ud9l6jaer6fp9dnneva23asrauxh5zdhsjzz8zh7lzh02synyd3se9l6mc # public key
```

From now on, we can generate/edit a secrets.enc.json using the following command:

```sh
sops secrets.enc.json
```

Make sure to:

- never edit the `secrets.enc.json` file directly (always use `sops`).
- only use `string` values in the `secrets.enc.json` file.
