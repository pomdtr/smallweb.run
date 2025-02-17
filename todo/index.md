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

## smallweb

- [ ] figure out why files are getting wiped out
- [ ] figure out why config is not reloading
- [ ] unix socket for deno workers
- [ ] smallweb api on unix socket or private port
- [ ] fix permissions in sftp server (ex: plugins are brokens on smallweb.live)
- [ ] add smallweb as a git remote (dokku inspired)
- [ ] use .local domain instead of .localhost
  - require to add a mdns server
  - add locally signed certificates
  - find a way to have my own ip (probably using wireguard-go)

## smallweb.live

- [ ] fix logging issue
- [ ] SMALLWEB_DIR bug vscode ?
- [ ] remove hard-coded paths in [smallweb.live](https://smallweb.live/)
- [ ] Add support for `_smallweb` record
- [ ] use caddy rest api for wildcard certificates

## Codejar

- [ ] add dark mode

## App Ideas

- pastebin as a service (inspired by pastes.sh)
- rss reader in the style of [tinyfeed](https://github.com/TheBigRoomXXL/tinyfeed)
- store based on the [`smallweb-app` github topic](https://github.com/topics/smallweb-app)
