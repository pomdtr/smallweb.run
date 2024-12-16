---
title: Smallweb TODO
---

# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run).

## Add support for encryption

New supported file: secrets.env, secrets.json

Decoded using [sops](https://github.com/getsops/sops/blob/main/decrypt/decrypt.go)

## VS Code Integration

## Smallweb Cloud

## Email Support

Each app should have it's own email address (`app@<domain>`).

```ts
import { Email } from "@smallweb/types"

export default {
  email: (msg: Email) {
    console.log(email.subject)
  }
}
```

Here is the val town email type for reference:

```ts
interface Email {
  from: string,
  to: string,
  cc: string,
  bcc: string,
  subject: string | undefined,
  text: string | undefined,
  html: string | undefined,
  attachments: File[],
}
```

## Smallweb SDK

An sdk for admin apps, that interact directly with the filesystem.

## Automatically install deno for the user

## Automatic backups to github / git repository

## Integrations

### Raycast Extension

https://github.com/pomdtr/smallweb-raycast

### VS Code Extension

#### Telegram Bot

## Website Redesign

The website was built in a rush. I'm planning to use [starlight](https://starlight.astro.build/) for the homepage, docs and blog.

## Record youtube videos for smallweb

I need to show the world the capabilities of smallweb, and the way I'm using it. I'll start a youtube channel to do so.

## Improved logs (done)

Currently, logs are awful. In the future, they will be accessible as a stream at` https://<api-domain>/v0/logs` (allowing you to access them from any client).

You'll also be able to access them using the CLI:

```sh
smallweb logs --app <app> --type [http|cron|console]
```

## `smallweb sync` (wrapper over mutagen)

```sh
mutagen sync create \
  --name=smallweb \
  --ignore-vcs \
  --ignore=node_modules \
  --mode=two-way-resolved \
  --stage-mode-alpha=internal \
  <token>@ssh.smallweb.run:/var/www/<user> ~/smallweb
```
