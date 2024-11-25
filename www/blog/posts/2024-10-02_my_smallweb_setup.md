---
title: My Smallweb Setup
sidebar: false
aside: false
prev: false
next: false
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

An alias in my `~/.ssh/config` file allows me to easily connect to my VPS:

```txt
Host smallweb.run
  HostName <vps-ip>
  User smallweb.run

Host pomdtr.me
  HostName <vps-ip>
  User pomdtr.me
```

Allowing me to just do `ssh smallweb.run` to get a shell.

## Wiring my server to cloudflare

I use cloudflare as my DNS provider. In order to proxy request to my smallweb instance, I installed `cloudflared` on my VPS, and created a tunnel for each of my smallweb instance.

I'm not really satisfied with this setup, and I want to switch to caddy at some point. Last time I tried, I had some issues setup up wildcard certificates, and quickly gave up.

## Syncing my smallweb folder using mutagen

On my laptop, I use [mutagen](https://mutagen.io/) to sync between my local folder and the remote one. It's incredibly fast, and I can work on my smallweb instance as if it was local.

You can setup mutagen with 3 commands:

```sh
# install mutagen
brew install mutagen-io/mutagen/mutagen
# make sure the daemon is running, and start at boot
mutagen daemon register
# create a sync session
mutagen sync create --name smallweb-run ~/smallweb/smallweb.run smallweb.run@<vps-ip>:/home/smallweb.run/smallweb --ignore_vcs --ignore=node_modules
```

I organize my smallweb folder like this:

```txt
/Users/pomdtr/smallweb
├── localhost
├── pomdtr.me
└── smallweb.run
```

The `localhost` folder contains a local instance of smallweb (accessible at `*.localhost`). `smallweb.run` and `pomdtr.me` are synced with my VPS. To move apps between instances, I can just drag and drop them in the folder I want.

I code using my local instance of VS Code, and each change is instantly synced. For example, I'm currrently writing this article from `~/smallweb.run/blog-preview`. When I run `deno task build`, I can instantly preview the article at `https://blog-preview.smallweb.run`.

In order to access the smallweb cli, I created a little wrapper script at `~/.local/bin/smallweb.run`:

```sh
#!/bin/sh

# shellcheck disable=SC2088
exec ssh -t -o LogLevel=QUIET smallweb.run '~/.local/bin/smallweb' "$@"
```

It allows me to run `smallweb.run ls` from my terminal, as if the cli was installed locally. The only issue with this method is that you don't get completions.

## Backing up my smallweb folder

Some of my apps are versionned using git, but these github repository are only present on my laptop, and are not synced to my VPS (see the --ignore_vcs flag in the mutagen command).

On the vps side, I have a single `.git` folder at the root of my smallweb folder. I then use a hourly cron job to backup this folder to a private github repository (`https://github.com/pomdtr/smallweb.run`).

![smallweb.run backup](./img/smallweb-run-backup.png)

One of the cool thing about this setup is that I can then reference files from a specific backup using the commit hash, and then import from a smallweb app using deno!

```ts
import { helper } from "https://raw.githubusercontent.com/pomdtr/smallweb.run/0adca1a6dfe866df49d6b11071781ffb5ea31b52/discord/main.ts";
```

## Editing websites from phone/tablet

In order to edit websites from my phone, I use the webdav server built-in to smallweb, associated with [Material Files](https://play.google.com/store/apps/details?id=me.zhanghai.android.files&hl=en_US).

On my tablet, I make use of [Blink Shell](https://blink.sh/) to ssh into my VPS, and edit files using [kakoune](https://kakoune.org/).

But you have a plethory of options! I'm investigating bundling a vscode instance into smallweb, so you can edit your files from your browser.
