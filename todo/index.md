---
title: Smallweb TODO
favicon: https://icons.smallweb.run/smallweb.svg
head:
  - tag: script
    attrs:
      src: https://esm.smallweb.run/scripts/dot-shortcut.js
      data-url: https://editor.smallweb.run/todo/index.md
---

# Todo

This file is a public list of the next stuffs I want to work on for [smallweb](https://smallweb.run).

## Next Week

- OpenID Connect / Forward Auth
- Receiving email from smallweb apps
- move logs to `.smallweb/logs/<app>.jsonl`
- work on cursor demo

## tomorrow

1. upgrade pomdtr.me and demo.smallweb.live
2. jsonc support for `smallweb auth signin`
3. interactive auth flow

## smallweb

### Bugs

- [ ] fix permissions in sftp server (ex: plugins are brokens on smallweb.live)

### Features

- [ ] smallweb REST api on unix socket or private port
- [ ] use .local domain instead of .localhost
      - require to add a mdns server
      - add locally signed certificates
      - find a way to have my own ip (probably using wireguard-go)

- [x] add back `smallweb open`
- [x] add `git-receive-pack` and `git-upload-pack` commands
- [ ] unix socket for deno workers

## [smallweb.live](https://smallweb.live)

### Bugs

- [ ] figure out why config is not reloading

### Features

- [ ] interactive output in smallweb.live
- [ ] investigate logging / deno opentelemetry support
- [ ] Add support for `_smallweb` record

## vscode extension

- [ ] split the extension in 2 (fs-provider and smallweb)

## codejar app

- [ ] add dark mode

## app ideas

- pastebin as a service (inspired by pastes.sh)
- rss reader in the style of [tinyfeed](https://github.com/TheBigRoomXXL/tinyfeed)
- store based on the [`smallweb-app` github topic](https://github.com/topics/smallweb-app)
