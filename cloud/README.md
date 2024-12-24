---
title: Smallweb Cloud
favicon: https://icons.smallweb.run/smallweb.svg
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

## Editing your files

All the standard ssh commands will be supported: `sshfs`, `scp`, `sftp`, `rsync`, etc.

In addition to these, smallweb.live will supports [mutagen](https://mutagen.io) for real-time file sync.

```sh
# install mutagen
brew intall mutagen-io/mutagen/mutagen
mutagen daemon register

# start the mutagen-powered sync
smallweb sync <user>@smallweb.live

# list your apps
smallweb ls
```

You'll also be able to access an admin TUI by running `ssh <user>@smallweb.live`.

---

> [!NOTE]
> Interested in smallweb.live ? Join the [waitlist](https://cloud.smallweb.run).
