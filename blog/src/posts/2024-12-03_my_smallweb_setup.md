---
title: My Smallweb Setup
author: Achille Lacoin
tags:
    - article
---

Smallweb is still WIP, so I'm discovering new ways to use it every weeks. But in the past month, I've found a setup I'm satisfied with, so I'm sharing it here.

This article is inspired by [nydg article](https://www.smallweb.ndyg.co/) about his own setup using [Sidepro](https://sidepro.cloud).

I'll try to update this article each time I discover something new.

<!-- more -->

## Hosting smallweb

I host all of the websites under the `smallweb.run` domain on a 5$ Hetzner VPS. The setup script I used is quite simple:

```sh
# create user with homedir and default shell
useradd --system --user-group --create-home --shell $(which bash) smallweb.run

# set a password for the smallweb user
passwd smallweb.run

# give the user sudo access (optional)
usermod -aG sudo smallweb.run

# allow the user to use systemd
usermod -aG systemd-journal smallweb.run

# run user services on login
loginctl enable-linger smallweb.run

# install unzip (required for deno)
sudo apt update && sudo apt install unzip

# install deno
curl -fsSL https://deno.land/install.sh | sh # install deno

# install smallweb
curl -sSfL https://install.smallweb.run | sh # install smallweb

# start the smallweb service
smallweb service install
```

Each smallweb instance get it's own user. Currently, I have two of them: `smallweb.run` and `pomdtr.me`, and I can easily switch between them using ssh:

```sh
# connect to the smallweb.run user
ssh smallweb.run@<vps-ip>
# list smallweb.run websites
smallweb ls
exit

# connect to the pomdtr.me user
ssh pomdtr.me@<vps-ip>
# list pomdtr.me websites
smallweb ls
exit
```

An alias in my `~/.ssh/config` file allows me to easily connect to my VPS using `ssh smallweb.run` or `ssh pomdtr.me`:

```txt
Host smallweb.run
  HostName ssh.smallweb.run
  User smallweb.run

Host pomdtr.me
  HostName ssh.pomdtr.me
  User pomdtr.me
```

## Wiring my server to cloudflare

I use cloudflare as my DNS provider, and caddy as my reverse proxy, with the following Caddyfile:

```txt
{
  admin unix//var/run/caddy/admin.sock
}

smallweb.run, *.smallweb.run {
  tls {
    dns cloudflare {env.CF_API_TOKEN}
  }

  reverse_proxy localhost:7777
}

pomdtr.me, *.pomdtr.me {
  tls {
    dns cloudflare {env.CF_API_TOKEN}
  }

  reverse_proxy localhost:7778
}
```

Note that I use an unix socket to expose the caddy admin api, as I don't want my smallweb apps to be able to change the caddy configuration.

## Setting up file encryption for secrets

In order to share my secrets between my laptop and my VPS, I leverage the smallweb sops integration. On both end, I had to generate an age keypair, then I added the public keys to the [`.sops.yaml` config file](https://github.com/pomdtr/smallweb.run/tree/main/.sops.yaml).

```sh
# install age and sops
sudo apt install age sops

# generate an age keypair
age-keygen -o ~/.config/sops/age/keys.txt
```

## Syncing my smallweb folder using mutagen

On my laptop, I use [mutagen](https://mutagen.io/) to sync between my local folder and the remote one. It's incredibly fast, and I can work on my smallweb instance as if it was local.

You can setup mutagen with 3 commands:

```sh
# install mutagen
brew install mutagen-io/mutagen/mutagen
# make sure the daemon is running, and start at boot
mutagen daemon register
# create a sync session
mutagen sync create --name smallweb-run smallweb.run@<vps-ip>:/home/smallweb.run/smallweb ~/smallweb/smallweb.run --mode=two-way-resolved --ignore_vcs --ignore=node_modules
```

I organize my smallweb folder like this:

```txt
/Users/pomdtr/smallweb
├── pomdtr.me
└── smallweb.run
```

In order for it to work, I had to set the `SMALLWEB_DIR` environment variable in my shell configuration.

I also use direnv and the following `.envrc` to automatically set the `SMALLWEB_DIR` to `~/smallweb/pomdtr.me` folder when I `cd` into it.

```sh
#!/bin/sh

export SMALLWEB_DIR="$PWD"
```

## Backing up my smallweb folder

I use git to backup my smallweb folder. You can checkout the [smallweb.run](https://github.com/pomdtr/smallweb.run) and [pomdtr.me](https://github.com/pomdtr/pomdtr.me) monorepos.

When an app becomes too big, I move it to a separate repository, and use git submodules to include it in the main repository.

I use two smallweb plugins to help me with this workflow: `smallweb pull` and `smallweb push`. You can find the source code for these plugins in the [`.smallweb/plugins` directory](https://github.com/pomdtr/smallweb.run/tree/main/.smallweb/plugins).

## Some cool admin apps

I can create new apps right from my browser, by accessing vscode from vscode.smallweb.run or vscode.pomdtr.me
