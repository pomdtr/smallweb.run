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
> Make sure to run `sops updatekeys ~/samllweb/*/secrets.enc.env` after adding new public keys

From now on, we can generate/edit a`secrets.enc.env` using the following command:

```sh
sops secrets.enc.env
```

> [!WARNING] Make sure to never edit the encrypted file directly!

If you want to use a smallweb subcommand instead, you can use the following plugin at `$SMALLWEB_DIR/.smallweb/plugins/secrets.sh` (it requires [nushell](https://www.nushell.sh/) to be installed):

```sh
#!/usr/bin/env nu

# Edit smallweb secrets
def main [
    app?: string # The application to manage secrets for
    --global (-g) # Use the global secrets file
]: nothing -> nothing {
    if ($global) {
        sops $"($env.SMALLWEB_DIR)/.smallweb/secrets.enc.env"
    } else if ($app != null) {
        sops $"($env.SMALLWEB_DIR)/($app)/secrets.enc.env"
    } else if ((pwd | path dirname) == $env.SMALLWEB_DIR) {
        sops secrets.enc.env
    } else {
        print --stderr "No application specified and not in a smallweb application directory."
    }
}
```
