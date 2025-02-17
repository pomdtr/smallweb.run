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
> smallweb.live does not exist yet, this is just proposal. Add your email to the [waitlist](https://cloud.smallweb.run) to be among the first to get access to it!

## Introduction

Smallweb cloud will allow you to test out smallweb without buying your own domain. It's strongly inspired by both [blot.im](https://blot.im), [val.town](https://val.town), [pico.sh](https://pico.sh), and [piku](https://piku.github.io).

You will interact with smallweb.live using the openssh cli.

## Authentication

Just run `ssh accounts@smallweb.live signup <username>`. If no user has own this username yet, you'll be able to claim it by confirming your email.

If you then run `ssh <username>@smallweb.live`, you'll be greated with the smallweb cli.

```console
$ ssh <username>@smallweb.live
Host websites from your internet folder

Usage:
  smallweb [flags]
  smallweb [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  ...
```

## Usage

You can use any sftp-compatible tool to edit your files (the official recommendation will be [rclone](https://rclone.org/)).

Then, just create `~/smallweb/example/main.ts`:

```ts
export default {
    fetch: (_req: Request) => {
        return new Response("Welcome to Smallweb!");
    },
    run: (_args: string[]) => {
        console.log("Welcome to Smallweb!");
    },
};
```

The `fetch` endpoint will be available at `example.<user>.smallweb.live`.

```console
$ curl https://example.<user>.smallweb.live
Welcome to Smallweb!
```

The `run` endpoint will be available at `example.<user>@smallweb.live`.

```console
$ ssh example.<user>@smallweb.live
"Welcome to Smallweb!"
```
