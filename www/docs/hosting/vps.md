# VPS

This page will guide you through the process of hosting smallweb on a VPS. Any VPS provider will work, but if you're looking for a recommendation, I had a good experience with [Hetzner](https://www.hetzner.com/cloud).

## Install Docker

```sh
apt update && apt install -y curl
curl -fsSL https://get.docker.com | sh
```

## Setup the `smallweb` user

```sh
# Create a system user for smallweb
useradd --system --user-group --create-home --shell "$(which bash)" smallweb

# Create a SSH key for the smallweb user
mkdir -p /home/smallweb/.ssh
cp /root/.ssh/authorized_keys /home/smallweb/.ssh/authorized_keys
ssh-keygen -t ed25519 -f /home/smallweb/.ssh/id_ed25519 -N ""
chown -R smallweb:smallweb /home/smallweb/.ssh
```

## Setup Compose project

```sh
mkdir -p /opt/docker/smallweb
cat <<EOF > /opt/docker/smallweb/compose.yaml
services:
  smallweb:
    image: ghcr.io/pomdtr/smallweb:latest
    restart: unless-stopped
    command: up --on-demand-tls --enable-crons --ssh-addr :2222
    ports:
      - 80:80
      - 443:443
      - 2222:2222
    environment:
      - PUID=$(id -u smallweb)
      - PGID=$(id -g smallweb)
    volumes:
      - /home/smallweb/smallweb:/smallweb
      - /home/smallweb/.ssh/id_ed25519:/home/smallweb/.ssh/id_ed25519
      - deno_cache:/home/smallweb/.cache/deno

volumes:
  deno_cache:
EOF
```

## Setup and start smallweb

```sh
SMALLWEB_DOMAIN=$(curl -s https://api.ipify.org | tr '.' '-' | xargs printf '%s.sslip.io')

cd /opt/docker/smallweb
docker compose run --rm smallweb init --domain "$SMALLWEB_DOMAIN"
docker compose up -d
```
