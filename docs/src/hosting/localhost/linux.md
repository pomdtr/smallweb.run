## Ubuntu / Debian setup

### Install Deno {#install-deno-ubuntu}

```sh
curl -fsSL https://deno.land/install.sh | sh
# add ~/.deno/bin to PATH
echo "export PATH=\$PATH:\$HOME/.deno/bin" >> ~/.bashrc
```

### Setup Smallweb {#setup-smallweb-ubuntu}

```sh
curl -fsSL https://install.smallweb.run | sh
# add ~/.local/bin to PATH
echo "export PATH=\$PATH:\$HOME/.local/bin" >> ~/.bashrc
smallweb service install
```

### Setup Caddy {#setup-caddy-ubuntu}

```sh
sudo apt install -y caddy

# Write caddy configuration
cat <<EOF > /etc/caddy/Caddyfile
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

There is no need to setup dnsmasq on Ubuntu, as it seems to be already configured to resolve `.localhost` domains to `127.0.0.1`.

### Testing the setup {#testing-setup-ubuntu}

First, let's create a dummy smallweb website:

```sh
mkdir -p ~/smallweb/example
CAT <<EOF > ~/smallweb/example/main.ts
export default {
  fetch() {
    return new Response("Smallweb is running");
  }
}
EOF
```

If everything went well, you should be able to access `https://example.localhost` in your browser, and see the message `Smallweb is running`.
