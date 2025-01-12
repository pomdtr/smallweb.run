---
title: Smallweb TODO
favicon: https://icons.smallweb.run/smallweb.svg
head:
  - tag: script
    attrs:
      src: https://esm.smallweb.run/scripts/dot-shortcut.js
      data-url: https://editor.smallweb.run/todo/index.md
---

# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run).

# Authentication

## Setup

1. You put a public key in `~/smallweb/<app>/authorized_keys`
2. You set the `private` field to true in the `smallweb.json` file

## Auth Flow

Someone goes to the website, he is greeted with the github oauth login page. Once he logs in, smallweb fetch the _verified_ public keys of the user from the api, then compare them with the `authorized_keys` file. If a match is found, the user is granted access to the website.

## Admin users

Admin users have read/write to your whole smallweb directory. You can add them by putting their public key in `~/smallweb/.smallweb/authorized_keys`. All public keys from `~/.ssh` are automatically trusted as admin keys.

## Open question

What about non-interactive auth ? Maybe we can sign a token with the host key ?

## Injected SMALLWEB_TOKEN variable

> [!WARNING] still need some thoughts

- generate a random token when smallweb starts, shared between websites
- useful to validate that a request is coming from another website of the same user

## App Ideas

- Automatically generate web UI (form), cli and api based on the content of the folder
- Loom alternative using the [MUX](https://www.mux.com/) api
- Store based on the [`smallweb-app` github topic](https://github.com/topics/smallweb-app)
- pastebin as a service (inspired by pastes.sh)
