---
title: Smallweb TODO
favicon: https://icons.smallweb.run/smallweb.svg
---

# Todo

This file is a public list of the next stuffs I want to work on for [smallweb](https://smallweb.run).

## tomorrow

1. upgrade pomdtr.me and demo.smallweb.live
1. fix vscode error
2. add git support in smallweb.live
3. jsonc support for `smallweb auth signin` 

## smallweb

- [ ] investigate error on smallweb link
- [x] add back `smallweb open`
- [s] add `git-receive-pack` and `git-upload-pack` commands
- [ ] unix socket for deno workers
- [ ] smallweb REST api on unix socket or private port
- [ ] fix permissions in sftp server (ex: plugins are brokens on smallweb.live)
- [ ] figure out why config is not reloading
- [ ] use .local domain instead of .localhost
      - require to add a mdns server
      - add locally signed certificates
      - find a way to have my own ip (probably using wireguard-go)

## [smallweb.live](https://smallweb.live)

- [ ] fix tayzen vscode bug
- [x] add support for sops
- [x] use caddy rest API for wildcard certificates
- [ ] fix logging issue
- [ ] remove hardcoded paths in [smallweb.live](https://smallweb.live/)
- [ ] Add support for `_smallweb` record

## vscode extension

- [ ] split the extension in 2 (fs-provider and smallweb)

## codejar app

- [ ] add dark mode

## app ideas

- pastebin as a service (inspired by pastes.sh)
- rss reader in the style of [tinyfeed](https://github.com/TheBigRoomXXL/tinyfeed)
- store based on the [`smallweb-app` github topic](https://github.com/topics/smallweb-app)
