# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run).

## Manipulate a remote smallweb instance from the cli

You should be able to interact with a remote smallweb instance as if it was a local one (with completions, unable to open an url in browser, ...)

In order to achieve this, the management command from the cli should always interact with the REST API, either:

- through an unix socket if the cli and the evaluation server are on the same machine
- using http request if the cli and evaluation servers are on different machines

The only exception will be the `smallweb run`, that should probably use ssh.

## Integrations

### Telegram Bot

- Distributed as a smallweb app

### Raycast Extension

https://github.com/pomdtr/smallweb-raycast

### VS Code Extension

## Website Redesign

The website was built in a rush. I'm planning to use [starlight](https://starlight.astro.build/) for the homepage, docs and blog.

## Record youtube videos for smallweb

I need to show the world the capabilities of smallweb, and the way I'm using it. I'll start a youtube channel to do so.

## SMTP Server

## Smallweb Cloud

Smallweb cloud will allow you to register your own namespace on the `smallweb.run` domain.

First, you'll need to go to `signup.smallweb.run`, and input your email address.

You'll then be able to edit your smallweb config from the browser, and associate your public key with your account.

Your apps will be accessible at:

- `https://<app>.<user>.smallweb.run` for the `fetch` handler
- `ssh <app>.<user>@smallweb.run [args]` for the `run` handler

Of course, you'll be able to register your own domain instead, changing the endpoint to:

- `https://<app>.<domain>` for the `fetch` handler
- `ssh <app>@<domain> [args]` for the `run` handler

You'll then be able to sync your smallweb folder with a local folder using [mutagen](https://mutagen.io/):

```sh
mutagen sync create --name smallweb <user>@smallweb.run:/home/<user>/smallweb ~/smallweb
```

## `smallweb tunnel` command (done)

```console
$ smallweb tunnel <app>
Your app is now accessible at https://<app>-<tunnel-id>.smallweb.live
```

Behind the scenes, it creates a ssh tunnel using:

```sh
ssh -R 80:localhost:<freeport> -p 2222 localhost.run
```

You'll have the ability to use your own proxy server with the `smallweb proxy` command.

You can set a custom one using:

```json
{
    "proxy": "<proxy-address>"
}
```

## Token Scope (done)

Currently, auth tokens have access to everything. You should be able to limit the scope of a token.

```sh
# has access to everything, including `cli.<domain>` to run cli commands.
smallweb token create --admin
# only has access to the `tldraw.<domain>` and `bookmarks.<domain>` apps.
smallweb token create --app tldraw --app bookmarks
```

## REST API (done)

Each smallweb instance should come with a REST API, that you can serve on any domain using:

```json
{
    "private": true,
    "entrypoint": "smallweb:api",
    "publicRoutes": [
        "/openapi.json"
    ]
}
```

The api will include an OpenAPI spec, allowing me to automatically generates a typed deno client for it, distributed on JSR.

The api should also be available to the smallweb CLI using a unix socket.

## Improved logs (done)

Currently, logs are awful. In the future, they will be accessible as a stream at https://<api-domain>/v0/logs (allowing you to access them from any client).

You'll also be able to access them using the CLI:

```sh
smallweb logs --app <app> --type [http|cron|console]
```
