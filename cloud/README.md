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
> Smallweb Cloud does not exist yet. This is a proposal.

## Introduction

Smallweb cloud will allow to use smallweb without having to buy a VPS or register a domain.

You apps will be available at `https://<app>.<username>.smallweb.live`.

## Authentication

First, you'll need to sign up for an account. You can do this by running the following command:

```sh
# send an email with a confirmation code
ssh accounts@smallweb.live signup --email <email> --user <username>

# confirm the code
ssh accounts@smallweb.live confirm <code>
```

On sucessful signup, smallweb cloud associate your public ssh key with your account.

To link a public key from another device to your account, just run the following command:

```sh
# send an email with a confirmation code
ssh accounts@smallweb.live link <username>

# confirm the code
ssh accounts@smallweb.live confirm <code>
```

## Creating apps

The whole experience will be inspired by [pico.sh](https://pico.sh).
All the standard ssh commands will be supported: `sshfs`, `scp`, `sftp`, `rsync`, etc...

Want to quickly edit a file ? Just use `vim scp://<user>@smallweb.live/example/main.ts`.
But if you want to do proper work, you'll probably want to install [mutagen](https://mutagen.io) and setup the bi-directional sync:

```sh
# install mutagen
brew intall mutagen-io/mutagen/mutagen
mutagen daemon register

# start the mutagen-powered between ~/smallweb and <user>.smallweb.live:/home/<user>/smallweb
smallweb sync <user>@smallweb.live

# list your apps
smallweb ls
```

You'll also be able to access an admin TUI by running `ssh <user>@smallweb.live`.

---

> [!NOTE]
> Interested in smallweb.live ? Join the [waitlist](https://cloud.smallweb.run).
