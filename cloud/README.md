---
title: Smallweb Cloud
favicon: https://icons.smallweb.run/smallweb.svg
head:
  - tag: script
    attrs:
      src: https://raw.esm.sh/gh/pomdtr/smallweb.run/scripts/dot-shortcut.js
      data-url: https://editor.smallweb.run/cloud/README.md
---

# smallweb.live

> [!WARNING]
> smallweb.live does not exist yet. This is a proposal.

## Introduction

Smallweb cloud will allow you to test out smallweb without buying your own domain. It's strongly inspired by both [takingnames.io](https://takingnames.io), [localhost.run](https://localhost.run) and [pico.sh](https://pico.sh).

Your apps will be available at `https://<app>.<user>.smallweb.live`.

You will interact with smallweb.live using the openssh cli.

## Authentication

First, you'll need to run `ssh login@smallweb.live`. You'll then go through the [github device auth flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow), and your ssh key will be linked to your github account id.

From now, you be able to run `vim scp://<gh-user>@smallweb.live/authorized_keys` to manage your ssh keys.

## DNS

A user will own the domain `<user>.smallweb.live`, and be able to link it with it's own vps. This means that http requests, ssh commands and smtp messages to `user.smallweb.live` (or `user@smallweb.live`) will be handled by <vps-ip>.

## SSH Public keys

The public ssh keys for any user will be available at `https://github.com/<user>.keys`.

## Rent a VPS

If you do not want to manage your own vps, you'll be able to rent one. You will not be root in this VPS, but you'll have the ability to edit your files using mutagen or vscode remote ssh.