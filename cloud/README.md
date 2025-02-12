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

You will interact with smallweb.live using the openssh cli.

## Authentication

First, you'll need to run `ssh signup@smallweb.live`. After validating your email, you'll be able to create a new account.

If you then run `ssh <username>@smallweb.live`, you'll be greated with the smallweb cli.

To add a new ssh keu, either run `vim scp://<username>@smallweb.live/.smallweb/authorized_keys`, or use `ssh login@smallweb.live` and validate your email.

## Usage

The `fetch` endpoint will be available at `<app>.<user>.smallweb.live`.

The `run` endpoint will be available at `ssh <app>.<user>@smallweb.live`.