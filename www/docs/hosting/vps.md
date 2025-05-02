---
outline: [2, 3]
---

# VPS

This page will guide you through the process of hosting smallweb on a fresh new VPS running debian 12.

Any VPS provider will work, but if you're looking for a recommendation, I had a good experience with [Hetzner](https://www.hetzner.com/cloud).

Of course, there are an infinite way to hook up smallweb to your own setup, so feel free to adapt the guide to your own needs.

## Guide

In the following guide, I will assume you own the domain `example.com` and want to host smallweb on it.

You can replace `example.com` with your own domain.

### Setup DNS Records

First, you need to set up your DNS records to point to your VPS on your domain registrar.

```txt
example.com. 3600 IN A <your-ipv4>
*.example.com. 3600 IN A <your-ipv4>
example.com. 3600 IN AAAA <your-ipv6>
*.example.com. 3600 IN AAAA <your-ipv6>
example.com. 3600 IN MX 10 mail.example.com.
```

You can find your IPv4 and IPv6 addresses by running the following command on your VPS:

```sh
# IPv4
curl -4 https://icanhazip.com

# IPv6
curl -6 https://icanhazip.com
```

If you do not own a domain yet, you can use a free [sslip.io](https://sslip.io/) domain. Ex: `37.27.85.244` -> `37-27-85-244.sslip.io`.

### Install Docker

```sh
apt update && apt install -y curl
curl -fsSL https://get.docker.com | sh
```

### Setup the `smallweb` user

```sh
# Create a system user for smallweb
useradd --user-group --create-home --shell "$(which bash)" --uid 1000 smallweb

# Create a SSH key for the smallweb user
mkdir -p /home/smallweb/.ssh
cp /root/.ssh/authorized_keys /home/smallweb/.ssh/authorized_keys
ssh-keygen -t ed25519 -N "" -f /home/smallweb/.ssh/id_ed25519
chown -R smallweb:smallweb /home/smallweb/.ssh

# Create an empty directory for smallweb
mkdir -p /home/smallweb/smallweb
chown -R smallweb:smallweb /home/smallweb/smallweb
```

### Setup Compose project

Create the following directory structure:

```yaml
# /opt/docker/smallweb/compose.yaml
services:
  smallweb:
    image: ghcr.io/pomdtr/smallweb:latest
    restart: unless-stopped
    command: up --enable-crons --ssh-addr :2222 --smtp-addr :25 --ssh-private-key /run/secrets/ssh_private_key --on-demand-tls
    secrets:
      - ssh_private_key
    ports:
      - "80:80"
      - "443:443"
      - "2222:2222"
      - "25:25"
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - /home/smallweb/smallweb:/smallweb
      - deno_cache:/home/smallweb/.cache/deno
      - certmagic_cache:/home/smallweb/.cache/certmagic

secrets:
  ssh_private_key:
    file: "/home/smallweb/.ssh/id_ed25519"

volumes:
  deno_cache:
  certmagic_cache:
```

Then init the smallweb workspace and start the service:

```sh
cd /opt/docker/smallweb
# init smallweb workspace
docker compose run smallweb init --domain "example.com"
docker compose up -d
```

### Edit your local ssh config

Add the following to your `~/.ssh/config` file:

```txt
Host example.com
  Hostname example.com
  User _
  Port 2222
```

Now you can use `ssh example.com` to access the smallweb cli, and `ssh <app>@example.com` to access an app cli.

### Sync your smallweb dir locally

First, install [Mutagen](https://mutagen.io/documentation/introduction/installation/). Then, run the following command to sync your local smallweb directory with the remote smallweb directory:

```sh
# run mutagen daemon on login
mutagen daemon register

# This command should be run on your local machine
mutagen sync create \
  --name=smallweb \
  --ignore=node_modules,.DS_Store \
  --ignore-vcs \
  --mode=two-way-resolved \
  smallweb@<vps-ip>:smallweb ~/smallweb
```
