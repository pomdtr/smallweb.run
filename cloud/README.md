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

Smallweb cloud will allow you to use smallweb without having to rent a VPS or register a new domain.

Your app websites will be accessible at `https://<app>.<username>.smallweb.live`, and the cli entrypoint will be at `ssh <username>@smallweb.live run <app>`.

The whole experience is inspired by [pico.sh](https://pico.sh).

## Connecting to your account

Smallweb Cloud will delegate user management to github. To authenticate, you'll just need to run `ssh <username>@smallweb.live`. 

You'll then go through github device flow, and associate a github account to your public key.  Your public key will be added to the `~/smallweb/.smallweb/authorized_keys` file.

## Creating apps

All the standard ssh commands will be available: `sshfs`, `scp`, `sftp`, `rsync`... In addition to these, some subcommands from the smallweb cli will be supported (ex: `ls`, `logs`, ...).

Want to quickly edit a file ? Just use `vim scp://<username>@smallweb.live/./example/main.ts` !

But if you want to do proper work, you'll probably want to install [mutagen](https://mutagen.io) and setup the bi-directional sync:

```sh
# install mutagen
brew install mutagen-io/mutagen/mutagen
mutagen daemon register

# start the mutagen-powered between ~/smallweb and smallweb.live:/home/<user>/smallweb
smallweb sync <user>@smallweb.live

# list your apps
smallweb ls
```

## TLS certificates

Smallweb cloud will be able to emit wildcard TLS certificates by using it's own DNS (ex: `https://<app>.<custom-domain>`). See <https://webapp.io/blog/wildcard-tls-certificates-on-demand/> for additional info on the mechanism.

---

> [!NOTE]
> Interested in smallweb.live ? Join the [waitlist](https://cloud.smallweb.run).
