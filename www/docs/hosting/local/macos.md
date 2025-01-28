# MacOS setup

In the future, we might provide a script to automate this process, but for now, it's a manual process.

## Install Brew

```sh
# install homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Install Deno {#install-deno-macos}

```sh
brew install deno
```

## Setup Smallweb {#setup-smallweb-macos}

```sh
brew install pomdtr/tap/smallweb

cat <<EOF > ~/Libray/LaunchAgents/com.github.pomdtr.smallweb.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>Label</key>
        <string>com.github.pomdtr.smallweb</string>
        <key>ProgramArguments</key>
        <array>
            <string>$(brew --prefix)/bin/smallweb</string>
            <string>up</string>
        </array>
        <key>EnvironmentVariables</key>
        <dict>
            <key>SMALLWEB_DIR</key>
            <string>$HOME/smallweb</string>
        </dict>
        <key>RunAtLoad</key>
        <true />
        <key>StandardOutPath</key>
        <string>$HOME/Library/Logs/smallweb.log</string>
        <key>StandardErrorPath</key>
        <string>$HOME/Library/Logs/smallweb.log</string>
        <key>WorkingDirectory</key>
        <string>$HOME/</string>
    </dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.github.pomdtr.smallweb.plist
launchctl start com.github.pomdtr.smallweb
```

## Setup Caddy {#setup-caddy-macos}

Caddy’s configuration path depends on whether you're using an Intel-based Mac or an Apple Silicon (M1/M2) Mac.

- **For Apple Silicon Macs**:

  ```sh
  brew install caddy

  # Write caddy configuration
  cat <<EOF > /opt/homebrew/etc/Caddyfile
  smallweb.localhost, *.smallweb.localhost {
    tls internal

    reverse_proxy localhost:7777
  }
  EOF
  ```

- **For Intel-based Macs**:

  ```sh
  brew install caddy

  # Write caddy configuration
  cat <<EOF > /usr/local/etc/Caddyfile
  smallweb.localhost, *.smallweb.localhost {
    tls internal

    reverse_proxy localhost:7777
  }
  EOF
  ```

### Run Caddy

```sh
# Run caddy in the background
brew services start caddy

# Add caddy https certificates to your keychain
caddy trust
```

## Setup dnsmasq {#setup-dnsmasq-macos}

The configuration path for dnsmasq also depends on your Mac's architecture.

- **For Apple Silicon Macs**:

  ```sh
  brew install dnsmasq

  # Write dnsmasq configuration
  echo "address=/.localhost/127.0.0.1" >> /opt/homebrew/etc/dnsmasq.conf
  ```

- **For Intel-based Macs**:

  ```sh
  brew install dnsmasq

  # Write dnsmasq configuration
  echo "address=/.localhost/127.0.0.1" >> /usr/local/etc/dnsmasq.conf
  ```

## Run dnsmasq

```sh
# Run dnsmasq in the background
sudo brew services start dnsmasq

# Indicates to the system to use dnsmasq for .localhost domains
sudo mkdir -p /etc/resolver
cat <<EOF | sudo tee -a /etc/resolver/localhost
nameserver 127.0.0.1
EOF
```

## Testing the setup {#testing-the-setup-macos}

First, let's create a dummy smallweb website:

```sh
mkdir -p ~/smallweb/.smallweb
cat <<EOF > ~/smallweb/.smallweb/config.json
{
  "domain": "smallweb.localhost"
}
EOF

mkdir -p ~/smallweb/example
cat <<EOF > ~/smallweb/example/main.ts
export default {
  fetch() {
    return new Response("Smallweb is running");
  }
}
EOF
```

If everything went well, you should be able to access `https://example.smallweb.localhost` in your browser, and see the message `Smallweb is running`.
