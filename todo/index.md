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

## smallweb.live

- rework auth mechanism (ssh `<user>@smallweb.live` instead of `ssh signup@smallweb.live`)
- Use unix sockets for the smallweb <-> deno communication
- investigate on demand wildcard tls certificates (or buy a subscription from https://zerossl.com/)

## Codejar

- add dark mode

## App Ideas

- Automatically generate web UI (form), cli and api based on the content of the folder
- Loom alternative using the [MUX](https://www.mux.com/) api
- Store based on the [`smallweb-app` github topic](https://github.com/topics/smallweb-app)
- pastebin as a service (inspired by pastes.sh)
- rss reader which dumps article to smallweb folder
