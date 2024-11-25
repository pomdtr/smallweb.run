# Windows (WSL)

## Install WSL

Follow the instructions on the [official documentation](https://learn.microsoft.com/en-us/windows/wsl/install).

The next commands in this guide should be run in the WSL terminal.

## Install Deno

```sh
curl -fsSL https://deno.land/install.sh | sh
# add ~/.deno/bin to PATH
echo "export PATH=\$PATH:\$HOME/.deno/bin" >> ~/.bashrc
```

## Setup Smallweb

```sh
curl -fsSL https://install.smallweb.run | sh
# add ~/.local/bin to PATH
echo "export PATH=\$PATH:\$HOME/.local/bin" >> ~/.bashrc
smallweb service install
```

## Setup Caddy

```sh
sudo apt-get update
sudo apt-get install -y caddy

# Write caddy configuration
cat <<EOF | sudo tee /etc/caddy/Caddyfile
*.localhost {
  tls internal {
    on_demand
  }

  reverse_proxy localhost:7777
}
EOF

sudo systemctl restart caddy
caddy trust
```

There is no need to setup dnsmasq on Windows, as it seems to be already configured to resolve `.localhost` domains to `127.0.0.1`.

## Testing the setup

First, let's create a dummy smallweb website:

```sh
mkdir -p ~/smallweb/example
cat <<EOF > ~/smallweb/example/main.ts
export default {
  fetch() {
    return new Response("Smallweb is running");
  }
}
EOF
```

If everything went well, you should be able to access `https://example.localhost` in your browser, and see the message `Smallweb is running`.
