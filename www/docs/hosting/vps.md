# VPS / Home Server

If you're using a Debian-based Server, you can follow these steps to setup smallweb.

These steps will also work on other distributions, but you may need to adjust the package manager commands (ex: `dnf install -y` instead of `apt install -y` for Fedora).

> [!TIP] If you want to host multiple smallweb instances, you should use on user per instance.
> A good practice is to use the smallweb domain as the username (ex: smallweb.run and pomdtr.me).

```sh
# connect to your server as root
ssh <root@your-server-ip>

# install some packages required for smallweb
apt update && apt install -y curl unzip

# create user with homedir and default shell
useradd --system --user-group --create-home --shell $(which bash) smallweb

# run user services on login
loginctl enable-linger smallweb

# add your public key to the smallweb user
mkdir -p /home/smallweb/.ssh
cp -r /root/.ssh/authorized_keys /home/smallweb/.ssh/authorized_keys
chown -R smallweb:smallweb /home/smallweb/.ssh
```

At this point, disconnect from the ssh session and switch to the `smallweb` user:

> [!WARNING] Do not use su!
> It will prevent you from installing the service.

```sh
# connect to your server as smallweb
ssh smallweb@<your-server-ip>

# install deno
curl -fsSL https://deno.land/install.sh | sh # install deno

# install smallweb
curl -sSfL https://install.smallweb.run | sh # install smallweb

# start the smallweb service
/home/smallweb/.local/bin/smallweb service install
```

To make your service accessible from the internet, you have multiple options:

1. setup a reverse proxy on port 443, mapping http requests to the smallweb service port (default 7777)
2. using cloudflare tunnel (see [cloudflare setup](./cloudflare/index.md))

## Syncing files using mutagen

Make sure to follow the [Syncing files using mutagen](../guides/file-sync.md) guide to keep your files in sync between your development machine and the server.
