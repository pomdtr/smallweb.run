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

First, you'll need to run `ssh login@smallweb.live`. You'll then go through the [github device auth flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow), and your ssh key will be linked to your github account.

If you're public key is listed in `https://github.com/<gh-user>.keys`, you will be able to skip the login steps.

From now, you be able to run `vim scp://<gh-user>@smallweb.live/authorized_keys` to manage your ssh keys.

## DNS

You'll be able to set new 

```txt
$ ssh pomdtr@smallweb.live records set A example 188.114.97.2 --ttl 300

$ dig A example.smallweb.live
example.pomdtr.smallweb.live.   300     IN      A       188.114.97.2
```

You'll also be able to set these records through sftp (each record will be materialized as json file.

## SSH Proxy

Once you're done, you'll be able to proxy http / ssh requests from `<gh-user>.smallweb.live` and `*.<gh-user>.smallweb.live` to your local instance of smallweb using:

```sh
ssh -R '*:80:localhost:7777' <gh-user>@smallweb.live
```

If you want to handle tls encryption yourself, just use:

```sh
ssh -R '*:443:localhost:7777' <gh-user>@smallweb.live
```

You will also be able to forward a single domain using:

```sh
ssh -R 'example.smallweb.live:80:localhost:8080' <gh-user>@smallweb.live
```

To prevent let's encrypt certificates issues, `*.smallweb.live` will be added to the [public suffix list](https://publicsuffix.org).

Of course, you'll also be able to associate a custom domain to the smallweb.live proxy by setting up some txt records:

```txt
CNAME *.yourcustomdomain.com -> <gh-user>.smallweb.live
```

For the apex domain, we'll use `_smallweb` TXT record

```txt
A yourcustomdomain.com -> <proxy-ipv4>
AAAA yourcustomdomain.com -> <proxy-ipv6>
TXT _smallweb.yourcustomdomain.com -> <gh-user>
```

## Renting a VPS

At some point, I want to allow user to buy a machine with smallweb preinstalled, and a smallweb.live domain set-up by default.

## Smallweb Integration

smallweb up will natively support smallweb.live:

```sh
smallweb up --proxy <gh-user>@smallweb.live

# E2EE encryption
smallweb up --proxy <gh-user>@smallweb.live --on-demand-tls
```

## SSO

`auth.smallweb.live` will include a login page similar to <https://lastlogin.net>, but only supporting github. It will use the same matching mecanism as the proxy to figure out which user should be allowed to authenticate.
